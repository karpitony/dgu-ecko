import { CourseInfo, CourseVodData } from '../types';

let totalVodCount = 0;
let completedVodCount = 0;
let totalAssignmentCount = 0;
let completedAssignmentCount = 0;

const MAX_CACHE_AGE_MS = 1000 * 60 * 60 * 4; // 4시간
const now = new Date();

/**
 * 콘텐츠 스크립트 삽입 여부 판단하는 함수
 * 콘텐츠 스크립트들은 삽입 시 투명 마커 태그를 만듬
 */ 
function hasContentScript(tabId: number, markerId: string): Promise<boolean> {
  const MARKER_TEMPLATE = `_ekco_marker_${markerId}`;
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: (id: string) => {
          return !!document.getElementById(id);
        },
        args: [MARKER_TEMPLATE],
      },
      (results) => {
        if (chrome.runtime.lastError || !results?.[0]?.result) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}
/**
 * 주어진 JS 파일을 탭에 동적으로 삽입(inject)한다.
 */
function injectContentScript(tabId: number, filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.scripting.executeScript(
      { 
        target: { tabId }, 
        files: [filePath] 
      },
      (results) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.error(`콘텐츠 스크립트 삽입 실패 [${filePath}]`, lastError);
          reject(lastError);
          return;
        }

        console.log(`콘텐츠 스크립트 삽입 성공 [${filePath}]`, results);
        resolve();
      }
    );
  });
}

/**
 * 탭에 메시지를 보내고, 콜백이 끝날 때까지 기다린다.
 */
function sendMessageToTab(tabId: number, message: any) {
  return new Promise<void>((resolve) => {
    chrome.tabs.sendMessage(tabId, message, () => {
      resolve();
    });
  });
}

/**
 * 이미 스토리지에 있으면 가져오고, 없으면 content_scripts/getCourseId.js 실행하여 가져온다.
 */
export async function getCourseIds(tabId: number): Promise<CourseInfo[]> {
  const { courseIds } = await chrome.storage.local.get('courseIds');
  if (courseIds?.length) {
    console.log('[이코] 스토리지에서 courseIds 불러옴');
    return courseIds;
  }

  if (!await hasContentScript(tabId, 'getCourseId')) {
    console.log('[이코] 콘텐츠 스크립트(getCourseId) 삽입 시작');
    await injectContentScript(tabId, 'content_scripts/getCourseId.js');
  } else {
    console.log('[이코] 콘텐츠 스크립트(getCourseId) 이미 삽입됨');
  }


  return new Promise<CourseInfo[]>((resolve) => {
    // 메시지 대기
    const listener = (message: any) => {
      if (message.type === 'COURSE_IDS') {
        chrome.runtime.onMessage.removeListener(listener);
        console.log('[이코] 수신된 courseIds:', message.data);

        chrome.storage.local.set({ courseIds: message.data }, () => {
          resolve(message.data);
        });
        totalVodCount = message.data.length;
      }
    };
    chrome.runtime.onMessage.addListener(listener);
  });
}

// 사이드패널 여는 코드
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
    console.log('[이코] Side panel behavior set: open on action click.');
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openSidePanel') {
    chrome.windows.getCurrent((currentWindow) => {
      if (currentWindow?.id !== undefined) {
        chrome.sidePanel.open({ windowId: currentWindow.id });
      }
    });
  }
});

interface GetCourseVodDataMsg {
  type: 'GET_COURSE_VOD_DATA';
  forceRefresh?: boolean;
}

interface CourseVodDataMsg {
  type: 'COURSE_VOD_DATA';
  lectures: any;
  courseId: string; 
  courseTitle: string;
}

type MessagePayload = GetCourseVodDataMsg | CourseVodDataMsg | any;

chrome.runtime.onMessage.addListener((message: MessagePayload, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_COURSE_VOD_DATA': {
      console.log('[이코] 강의 VOD 데이터 요청 (전체 강의 조회)');
      handleAllCourseVod(message?.forceRefresh)
        .then(() => sendResponse({ triggered: true }))
        .catch((err) => {
          console.error(err);
          sendResponse({ error: (err as Error).message });
        });
      return true;
    }

    case 'COURSE_VOD_DATA': {
      const { courseId, courseTitle, fetchedAt, lectures } = message.data;
      console.log(`[이코] ${courseTitle}(${courseId}) VOD 데이터 수신:`, lectures);
      
      const storageKey = `course_${courseId}_vod`;
      chrome.storage.local.set({ [storageKey] : message.data }, () => {
        console.log(`[이코] ${courseTitle}(${courseId}) 저장 완료: ${storageKey}`);
      });
      completedVodCount++;
      completeGetTotalVodCount();
      break;
    }
    
    case 'GET_COURSE_ASSIGNMENT_DATA': {
      console.log('[이코] 과제 데이터 요청');
      handleAllCourseAssignments(message?.forceRefresh)
        .then(() => sendResponse({ triggered: true }))
        .catch((err) => {
          console.error(err);
          sendResponse({ error: (err as Error).message });
        });
      return true;
    }

    case 'COURSE_ASSIGNMENT_DATA': {
      const { courseId, courseTitle, fetchedAt, assignments } = message.data;
      console.log(`[이코] ${courseTitle}(${courseId}) 과제 데이터 수신:`, assignments);

      const storageKey = `course_${courseId}_assignment`;
      chrome.storage.local.set({ [storageKey]: message.data }, () => {
        console.log(`[이코] ${courseTitle}(${courseId}) 과제 저장 완료: ${storageKey}`);
      });

      completedAssignmentCount++;
      completeGetTotalAssignmentCount();
      break;
    }

    default:
      break;
  }
});

async function handleAllCourseVod(
  forceRefresh = false
) {
  completedVodCount = 0;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0]?.id;
  if (!tabId) {
    throw new Error('탭 ID를 찾을 수 없습니다.');
  }

  const courseList = await getCourseIds(tabId);
  if (!courseList.length) {
    throw new Error('강의 목록을 불러올 수 없습니다.');
  } else {
    totalVodCount = courseList.length;
  }

  // 모든 코스에 대해 캐시 체크 후, 없으면 삽입

  console.log(`[이코] 콘텐츠 스크립트(fetchAndParseVod) 삽입 시작`);
  await injectContentScript(tabId, 'content_scripts/fetchAndParseVod.js');

  await Promise.all(
    courseList.map(async (course) => {
      const storageKey = `course_${course.id}_vod`;
      const result = await chrome.storage.local.get(storageKey);
      const cached = result[storageKey];
      const isCacheValid =
        cached &&
        cached.fetchedAt &&
        now.getTime() - new Date(cached.fetchedAt).getTime() < MAX_CACHE_AGE_MS;

      if (!forceRefresh && isCacheValid) {
        console.log(`[이코] 캐시 사용 : ${course.title}(${course.id})`);
        completedVodCount++;
        completeGetTotalVodCount();
        return;
      }

      await sendMessageToTab(tabId, {
        type: 'PARSE_VOD_FOR_ID',
        courseId: course.id,
        courseTitle: course.title,
      });
      console.log(`[이코] PARSE_VOD_FOR_ID 요청 완료: ${course.title}(${course.id})`);
    }),
  );
}

async function completeGetTotalVodCount() {
  if (completedVodCount === totalVodCount) {
    console.log('[이코] 전체 VOD 데이터 수집 완료');
    const { courseIds } = await chrome.storage.local.get('courseIds');

    let allVodData: CourseVodData[] = [];
    for (const course of courseIds) {
      const storageKey = `course_${course.id}_vod`;
      const result = await chrome.storage.local.get({ [storageKey]: null });
      allVodData.push(result[storageKey] ?? {});
    }

    chrome.runtime.sendMessage({ type: 'ALL_COURSE_VOD_DATA', payload: allVodData });
  }
}

async function handleAllCourseAssignments(
  forceRefresh = false
) {
  console.log('[이코] 과제 전체 수집 함수 진입');
  completedAssignmentCount = 0;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0]?.id;
  if (!tabId) {
    throw new Error('탭 ID를 찾을 수 없습니다.');
  }

  const courseList = await getCourseIds(tabId);
  if (!courseList.length) {
    throw new Error('강의 목록을 불러올 수 없습니다.');
  } else {
    totalAssignmentCount = courseList.length;
  }

  console.log(`[이코] 콘텐츠 스크립트(fetchAndParseAssignment) 삽입 시작`);
  await injectContentScript(tabId, 'content_scripts/fetchAndParseAssignment.js');

  await Promise.all(
    courseList.map(async (course) => {
      const storageKey = `course_${course.id}_assignment`;
      const result = await chrome.storage.local.get(storageKey);
      const cached = result[storageKey];
      const isCacheValid =
        cached &&
        cached.fetchedAt &&
        now.getTime() - new Date(cached.fetchedAt).getTime() < MAX_CACHE_AGE_MS;

      if (!forceRefresh && isCacheValid) {
        console.log(`[이코] 과제 캐시 사용: ${course.title}(${course.id})`);
        completedAssignmentCount++;
        completeGetTotalAssignmentCount();
        return;
      }

      await sendMessageToTab(tabId, {
        type: 'PARSE_ASSIGNMENT_FOR_ID',
        courseId: course.id,
        courseTitle: course.title,
      });
      console.log(`[이코] PARSE_ASSIGNMENT_FOR_ID 요청 완료: ${course.title}(${course.id})`);
    })
  );
}

async function completeGetTotalAssignmentCount() {
  if (completedAssignmentCount === totalAssignmentCount) {
    console.log('[이코] 전체 과제 데이터 수집 완료');
    const { courseIds } = await chrome.storage.local.get('courseIds');

    let allAssignmentData: CourseAssignmentData[] = [];
    for (const course of courseIds) {
      const storageKey = `course_${course.id}_assignment`;
      const result = await chrome.storage.local.get({ [storageKey]: null });
      if (result[storageKey]) {
        allAssignmentData.push(result[storageKey]);
      }
    }

    chrome.runtime.sendMessage({ type: 'ALL_COURSE_ASSIGNMENT_DATA', payload: allAssignmentData });
  }
}
