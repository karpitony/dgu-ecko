const courseElements = document.querySelectorAll('.course-label-r');
const courses = Array.from(courseElements).map(el => {
  const anchor = el.querySelector('a.course-link');
  if (!anchor) return null;

  const url = new URL((anchor as HTMLAnchorElement).href);
  const id = url.searchParams.get('id');

  const titleElement = anchor.querySelector('h3');
  const profElement = anchor.querySelector('.prof');

  return {
    id,
    title: titleElement?.innerText.trim() ?? '',
    professor: (profElement as HTMLElement)?.innerText.trim() ?? ''
  };
}).filter(Boolean); 

chrome.runtime.sendMessage({
  type: 'COURSE_IDS',
  data: courses
});
