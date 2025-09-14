import { VodLecture as ImportVodLecture, CourseVodData as ImportCourseVodData } from '../types';

type VodLecture = ImportVodLecture;
type CourseVodData = ImportCourseVodData;

/**
 * 이클래스 사이버 강의 정보를 가져오고 파싱
 */

export default defineContentScript({
  registration: 'runtime',
  main() {
    if ((window as any).__ECO_SCRIPT_LOADED__VOD) return;
    (window as any).__ECO_SCRIPT_LOADED__VOD = true;

    if (!document.getElementById('_ekco_marker_fetchAndParseVod')) {
      const marker = document.createElement('div');
      marker.id = '_ekco_marker_fetchAndParseVod';
      marker.style.display = 'none';
      document.body.appendChild(marker);
    }

    const ECLASS_VOD_URL = 'https://eclass.dongguk.edu/course/view.php?id=';

    console.log('[이코] Content script loaded on eclass page.');

    async function fetchCoursePage(courseId: string): Promise<string | null> {
      try {
        const response = await fetch(`${ECLASS_VOD_URL}${courseId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const htmlText = await response.text();
        console.log('[이코] Course page HTML fetched.');
        return htmlText;
      } catch (error) {
        console.error('[이코] Error fetching course page:', error);
        return null;
      }
    }

    function parseVodFromHtml(html: string): VodLecture[] {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const vodElements = doc.querySelectorAll('li.activity.vod');
      if (vodElements.length === 0) {
        console.warn('[이코] ⚠️ 사이버 강의(VOD)를 찾을 수 없습니다.');
        return [];
      }

      return Array.from(vodElements).map<VodLecture>(el => {
        const title =
          el
            .querySelector('.instancename')
            ?.textContent?.trim()
            .replace(/\s+동영상$/, '') ?? '';

        const viewAnchor = el.querySelector('.activityinstance a');
        const href = viewAnchor?.getAttribute('href') ?? '';
        const onclick = viewAnchor?.getAttribute('onclick') ?? '';
        const vodId = href.match(/id=(\d+)/)?.[1] ?? '';

        const viewerUrl = onclick.match(/window\.open\('([^']+viewer\.php\?id=\d+)'/)?.[1] ?? '';

        const dateText = el.querySelector('.displayoptions .text-ubstrap')?.textContent ?? '';
        const [startRaw, endRaw] = dateText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g) ?? [];
        const start = startRaw ?? '';
        const end = endRaw ?? '';
        const lateEnd =
          dateText.match(/\(지각 ?: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\)/)?.[1] ?? '';

        const completed =
          (el.querySelector('.autocompletion img') as HTMLImageElement)?.title.includes('완료함') ??
          false;
        const week = title.match(/^(\d+주차)/)?.[1] ?? '';

        return {
          week,
          title,
          vodId,
          viewUrl: href,
          viewerUrl,
          period: {
            start,
            end,
            lateEnd,
          },
          completed,
        };
      });
    }

    /**
     * 전체 사이버 강의 정보 fetch + 파싱
     */
    async function fetchAndParseVod(
      courseId: string,
      courseTitle: string,
    ): Promise<VodLecture[] | null> {
      const html = await fetchCoursePage(courseId);
      if (!html) return null;

      const lectures = parseVodFromHtml(html);
      console.log(`[이코] ${courseTitle}(${courseId}) 파싱된 사이버 강의 목록:`, lectures);
      const courseVodData: CourseVodData = {
        courseId,
        courseTitle,
        fetchedAt: new Date().toISOString(),
        lectures,
      };
      chrome.runtime.sendMessage({ type: 'COURSE_VOD_DATA', data: courseVodData });
      return lectures;
    }

    (() => {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'PARSE_VOD_FOR_ID' && message.courseId && message.courseTitle) {
          console.log(
            `[이코] 사이버 강의 정보 파싱 요청: ${message.courseTitle}(${message.courseId})`,
          );
          fetchAndParseVod(message.courseId, message.courseTitle)
            .then(() => sendResponse({ ok: true }))
            .catch(err => sendResponse({ ok: false, error: err.message }));
          return true; // 비동기 처리를 위해 반드시 필요
        }
      });
    })();
  },
});
