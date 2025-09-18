import { getSetting } from '@/libs/settings';

export default defineContentScript({
  matches: ['https://eclass.dongguk.edu/course/view.php?id=*'],
  registration: 'manifest',
  async main() {
    console.log('[이코] 스크립트 로드됨.');

    if (await getSetting('courseMultiSection')) {
      console.log('[이코] 설정이 활성화되어 있습니다. 주차 확장 기능을 시작합니다.');
      injectLayoutStyles();

      tryInitialExpansion(5);
      tryObserveTab(5);
    }
  },
});

/**
 * 최초 페이지 로드 시 active 탭이 준비될 때까지 기다렸다가 확장 함수를 실행합니다.
 * @param maxAttempts 최대 시도 횟수
 */
function tryInitialExpansion(maxAttempts: number): void {
  const activeTab = document.querySelector('ul.section_tab > li.active');

  if (activeTab) {
    console.log('[이코] Active Tab 발견. 최초 주차 확장을 실행합니다.');
    expandAdjacentWeeks();
  } else if (maxAttempts > 0) {
    console.log(`[이코] Active Tab 대기 중... ${maxAttempts}회 남음. 재시도...`);
    setTimeout(() => tryInitialExpansion(maxAttempts - 1), 100);
  } else {
    console.warn('[이코] Active Tab을 찾지 못하여 최초 주차 확장에 실패했습니다.');
  }
}

/**
 * 주차 탭 컨테이너가 로드되었는지 확인하고 MutationObserver를 등록합니다.
 * @param maxAttempts 최대 시도 횟수
 */
function tryObserveTab(maxAttempts: number): void {
  const tabContainer = document.querySelector('ul.section_tab');

  if (tabContainer) {
    console.log('[이코] 주차 탭 컨테이너 발견. MutationObserver를 등록합니다.');
    const observer = new MutationObserver(mutationsList => {
      let needsUpdate = true;
      for (const mutation of mutationsList) {
        // li 요소의 class 속성 변경(active 클래스 추가/제거)을 감지
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          needsUpdate = true;
          break;
        }
      }

      if (needsUpdate) {
        // 주차 탭 변경 후 DOM이 안정화될 시간을 약간 주기 위해 setTimeout 사용
        setTimeout(() => {
          console.log('[이코] Active Tab 변경 감지됨. 주차 확장 기능을 재실행합니다.');
          expandAdjacentWeeks();
        }, 50);
      }
    });

    // 탭 컨테이너의 자식 요소(li)에 있는 'class' 속성 변경을 감지
    observer.observe(tabContainer, { subtree: true, attributes: true, attributeFilter: ['class'] });
  } else if (maxAttempts > 0) {
    // 요소가 아직 없다면, 200ms 후 재시도
    console.log(`[이코] 주차 탭 컨테이너를 찾을 수 없습니다. ${maxAttempts}회 남음. 재시도...`);
    setTimeout(() => tryObserveTab(maxAttempts - 1), 200);
  } else {
    console.error(
      '[이코] 주차 탭 컨테이너(ul.section_tab)를 찾지 못하여 MutationObserver 등록에 실패했습니다.',
    );
  }
}

/**
 * 레이아웃에 필요한 모든 스타일을 페이지에 주입하는 함수
 */
function injectLayoutStyles(): void {
  if (document.getElementById('ecko-layout-styles')) return;

  const style = document.createElement('style');
  style.id = 'ecko-layout-styles';
  style.textContent = `
    /* 기본 설정: 가장 작은 화면에서는 1열이 되도록 설정 */
    ul.flexsections.flexsections-level-1 {
      display: grid;
      gap: 16px;
      /* 기본적으로 1열 */
      grid-template-columns: repeat(1, 1fr); 
    }

    /* 600px 이상은 2열 */
    @media (min-width: 600px) {
        ul.flexsections.flexsections-level-1 {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    /* 1000px 이상은 3열 */
    @media (min-width: 1000px) {
        ul.flexsections.flexsections-level-1 {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* 원하는 최소 높이 조정 */
    ul.flexsections-level-1 > li.section.main > div.content {
        min-height: 300px; /
    }

    /* 현재 주차 강조 스타일 */
    ul.flexsections-level-1 > li.section.main.current {
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
      border: 2px solid #3b82f6 !important;
    }

    /* ::before 가상 요소를 제거. */
    ul.flexsections-level-1 > li.section.main.current::before,
    ul.flexsections-level-1 > li.section.main::before {
        content: none !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * 현재 주차와 앞뒤 주차를 확장하여 총 3개 주차를 동시에 보여주는 함수 (Active Tab 기반)
 */
function expandAdjacentWeeks(): void {
  const allWeekSections = document.querySelectorAll<HTMLElement>(
    'ul.flexsections.flexsections-level-1 > li.section.main',
  );

  if (allWeekSections.length === 0) {
    console.warn('[이코] 주차 정보를 찾을 수 없습니다.');
    return;
  }

  const sectionsArray = Array.from(allWeekSections);
  const totalSections = sectionsArray.length;

  // 1현재 'active' 탭을 찾아서 해당 주차 섹션의 ID를 가져오기
  const activeTab = document.querySelector<HTMLLIElement>('ul.section_tab > li.active');
  if (!activeTab) {
    console.warn('[이코] 현재 활성화된 주차 탭(li.active)을 찾을 수 없습니다.');
    return;
  }

  const targetSectionId = activeTab.id;
  let currentSection: HTMLElement | undefined;

  sectionsArray.forEach(section => {
    section.classList.remove('current'); // 강조 스타일 제거
    section.style.display = 'none'; // 일단 모두 숨기기

    if (section.id === targetSectionId) {
      currentSection = section;
    }
  });

  if (!currentSection) {
    console.warn(`[이코] ID "${targetSectionId}"에 해당하는 주차 섹션을 찾을 수 없습니다.`);
    return;
  }

  currentSection.classList.add('current');
  const currentIndex = sectionsArray.indexOf(currentSection);

  let startIndex: number;
  let endIndex: number;

  if (totalSections <= 3) {
    // 총 섹션이 3개 이하면 모두 표시
    startIndex = 0;
    endIndex = totalSections - 1;
  } else if (currentIndex === 0) {
    startIndex = 0;
    endIndex = 2;
  } else if (currentIndex === totalSections - 1) {
    startIndex = totalSections - 3;
    endIndex = totalSections - 1;
  } else {
    startIndex = currentIndex - 1;
    endIndex = currentIndex + 1;
  }

  const sectionsToShow: HTMLElement[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (sectionsArray[i]) {
      sectionsToShow.push(sectionsArray[i]);
      sectionsArray[i].style.display = ''; // display:none 해제
    }
  }

  console.log(
    `[이코] Active Tab 기반으로 총 ${sectionsToShow.length}개의 주차 섹션을 확장하여 표시했습니다. (현재: ${targetSectionId})`,
  );
}
