interface Assignment {
  title: string;
  url: string;
  due: string | null; // "-"인 경우 null
  status: string; // 제출 완료, 미제출 등
}

interface CourseAssignmentData {
  courseId: string;
  courseTitle: string;
  fetchedAt: string; // YYYY-MM-DD
  assignments: Assignment[];
}

/**
 * 이클래스 과제 정보를 가져오고 파싱
 */

const ECLASS_ASSIGNMENT_URL = 'https://eclass.dongguk.edu/mod/assign/index.php?id=';

console.log('[이코] Content script (fetchAndParseAssignment) loaded on eclass page.');

async function fetchAssignmentPage(courseId: string): Promise<string | null> {
  try {
    const response = await fetch(`${ECLASS_ASSIGNMENT_URL}${courseId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const htmlText = await response.text();
    console.log('[이코] Assignment page HTML fetched.');
    return htmlText;
  } catch (error) {
    console.error('[이코] Error fetching assignment page:', error);
    return null;
  }
}

function parseAssignmentsFromHtml(html: string): Assignment[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const tableRows = doc.querySelectorAll('table.generaltable tbody tr');
  if (tableRows.length === 0) {
    console.warn('[이코] ⚠️ 과제 항목을 찾을 수 없습니다.');
    return [];
  }

  const assignments: Assignment[] = [];

  for (const row of tableRows) {
    // 구분선 row는 건너뛴다
    if (row.querySelector('.tabledivider')) continue;

    const titleAnchor = row.querySelector('td.c1 a');
    const title = titleAnchor?.textContent?.trim() ?? '';
    const url = titleAnchor?.getAttribute('href') ?? '';

    const dueRaw = row.querySelector('td.c2')?.textContent?.trim() ?? '';
    const due = dueRaw === '-' ? null : dueRaw;

    const status = row.querySelector('td.c3')?.textContent?.trim() ?? '제출 정보 없음';

    assignments.push({
      title,
      url,
      due,
      status,
    });
  }

  return assignments;
}


async function fetchAndParseAssignment(courseId: string, courseTitle: string): Promise<Assignment[] | null> {
  const html = await fetchAssignmentPage(courseId);
  if (!html) return null;

  const assignments = parseAssignmentsFromHtml(html);
  console.log(`[이코] ${courseTitle}(${courseId}) 파싱된 과제 목록:`, assignments);

  const courseAssignmentData: CourseAssignmentData = {
    courseId,
    courseTitle,
    fetchedAt: new Date().toISOString().slice(0, 10),
    assignments,
  };

  chrome.runtime.sendMessage(
    { type: 'COURSE_ASSIGNMENT_DATA', data: courseAssignmentData },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[이코] ⚠️ 과제 데이터 전송 실패:', chrome.runtime.lastError.message);
      } else {
        console.log('[이코] 과제 데이터 전송 성공:', response);
      }
    }
  );
  return assignments;
}

// 메시지 리스너
(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PARSE_ASSIGNMENT_FOR_ID' && message.courseId && message.courseTitle) {
      console.log(`[이코] 과제 정보 파싱 요청: ${message.courseTitle}(${message.courseId})`);
      fetchAndParseAssignment(message.courseId, message.courseTitle)
        .then(() => {
          sendResponse({ ok: true });
        })
        .catch((err) => {
          console.error('[이코] 과제 파싱 실패:', err);
          sendResponse({ ok: false, error: err.message });
        });
      return true; 
    }
  });
})();
