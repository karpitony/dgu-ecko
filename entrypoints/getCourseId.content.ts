export default defineContentScript({
  registration: 'runtime',
  main() {
    console.log('[이코] fetch 기반 getCourseId.js 실행됨');

    async function fetchCourses() {
      try {
        const res = await fetch('https://eclass.dongguk.edu/', {
          credentials: 'include', // 로그인 세션 쿠키 포함
        });
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const courseElements = doc.querySelectorAll('.course-label-r');
        const courses = Array.from(courseElements)
          .map(el => {
            const anchor = el.querySelector('a.course-link') as HTMLAnchorElement | null;
            if (!anchor) return null;

            const url = new URL(anchor.href);
            const id = url.searchParams.get('id');

            const titleElement = anchor.querySelector('h3');
            const profElement = anchor.querySelector('.prof');

            return {
              id,
              title: titleElement?.textContent?.trim() ?? '',
              professor: profElement?.textContent?.trim() ?? '',
            };
          })
          .filter(Boolean);

        console.log('[이코] 강의 목록:', courses);

        chrome.runtime.sendMessage({
          type: 'COURSE_IDS',
          data: courses,
        });

        console.log('[이코] getCourseId.js에서 메시지 전송 완료');
      } catch (err) {
        console.error('[이코] fetchCourses 실패:', err);
      }
    }

    fetchCourses();
  },
});
