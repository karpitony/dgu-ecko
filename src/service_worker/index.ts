import { CourseInfo, CourseVodData } from '../types';

export default async function getCourseIds(
  tabId: number
): Promise<CourseInfo[]> {
  
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('courseIds', (result) => {
      if (result.courseIds) {
        console.log('[이코] 스토리지에서 courseIds 불러옴');
        resolve(result.courseIds);
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ['content_scripts/getCourseId.js'],
        },
        () => {
          console.log('[이코] 콘텐츠 스크립트 삽입됨');

          // 메시지 대기
          const listener = (message: any) => {
            if (message.type === 'COURSE_IDS') {
              chrome.runtime.onMessage.removeListener(listener); 
              console.log('[이코] 수신된 courseIds:', message.data);

              chrome.storage.local.set({ courseIds: message.data }, () => {
                resolve(message.data);
              });
            }
          };

          chrome.runtime.onMessage.addListener(listener);
        }
      );
    });
  });
}

// 사이드패널 여는 코드
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
    console.log("[이코] Side panel behavior set: open on action click.");
  });
});

// 메시지 핸들러
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_COURSE_VOD_DATA') {
    console.log('[이코] 강의 VOD 데이터 요청:', message);

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        console.error('[이코] 탭 ID를 찾을 수 없습니다.');
        return;
      }

      // 개별 강의 처리
      if (message.courseId) {
        handleGetCourseVodData(message.courseId, tabId, sendResponse);
        return;
      }

      // courseId 없을 경우 → 전체 강의 목록 불러와서 모두 처리
      const courseList = await getCourseIds(tabId);
      if (!courseList.length) {
        sendResponse({ error: '강의 목록을 불러올 수 없습니다.' });
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      await Promise.all(
        courseList.map(async (course) => {
          const storageKey = `course_${course.id}_vod`;
          const result = await chrome.storage.local.get(storageKey);
          const cached = result[storageKey];

          if (cached && cached.fetchedAt === today) {
            console.log(`[이코] 📦 캐시 사용: ${course.id}`);
            return;
          }

          await new Promise<void>((resolve) => {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                files: ['content_scripts/fetchAndParseVod.js'],
              },
              () => {
                chrome.tabs.sendMessage(tabId, {
                  type: 'PARSE_VOD_FOR_ID',
                  courseId: course.id,
                }, () => {
                  console.log(`[이코] 콘텐츠 스크립트 실행 요청: ${course.id}`);
                  resolve();
                });
              }
            );
          });
        })
      );

      sendResponse({ triggered: true });
    });

    return true;
  }
});

// 단일 강의 처리
function handleGetCourseVodData(
  courseId: string,
  tabId: number,
  sendResponse: (response: any) => void
) {
  const storageKey = `course_${courseId}_vod`;
  const today = new Date().toISOString().slice(0, 10);

  chrome.storage.local.get(storageKey, (result) => {
    const cached = result[storageKey];

    if (cached && cached.fetchedAt === today) {
      console.log(`[이코] 캐시 사용: ${courseId}`);
      sendResponse({ fromCache: true, data: cached });
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ['content_scripts/fetchAndParseVod.js'],
      },
      () => {
        chrome.tabs.sendMessage(
          tabId,
          {
            type: 'PARSE_VOD_FOR_ID',
            courseId,
          },
          () => {
            console.log(`[이코] 콘텐츠 스크립트 실행 요청 (courseId: ${courseId})`);
            sendResponse({ fromCache: false, triggered: true });
          }
        );
      }
    );
  });
}

// 콘텐츠 스크립트에서 받은 결과 저장
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'COURSE_VOD_DATA') {
    console.log('[이코] VOD 데이터 수신:', message.lectures);

    const courseId = message.courseId || sender.tab?.url?.match(/id=(\d+)/)?.[1];
    const fetchedAt = new Date().toISOString().slice(0, 10);

    const dataToStore: CourseVodData = {
      courseId,
      courseTitle: message.courseTitle || '',
      lectures: message.lectures,
      fetchedAt,
    };

    if (courseId) {
      chrome.storage.local.set({ [`course_${courseId}_vod`]: dataToStore }, () => {
        console.log(`[이코] 저장 완료: course_${courseId}_vod`);
      });
    }
  }
});