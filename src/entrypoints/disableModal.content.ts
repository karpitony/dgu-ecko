import { getSetting } from '@/libs/settings';

export default defineContentScript({
  matches: ['https://eclass.dongguk.edu/'],
  registration: 'manifest',
  main() {
    const observer = new MutationObserver(hideModals);

    function injectStyle() {
      const style = document.createElement('style');
      style.textContent = `
        .ecko-modal-hidden {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
    function hideModals() {
      const modals = document.querySelectorAll<HTMLDivElement>('.modal.notice_popup');
      const hiddenModals: HTMLElement[] = [];

      modals.forEach(el => {
        if (!el.classList.contains('ecko-modal-hidden')) {
          el.classList.add('ecko-modal-hidden');
          hiddenModals.push(el);
        }
      });

      if (hiddenModals.length > 0) {
        showToast(`${hiddenModals.length}개의 공지 모달을 숨겼습니다.`, hiddenModals);
        console.log('숨긴 모달들:', hiddenModals);
      }
    }

    function showToast(message: string, modals: HTMLElement[]) {
      const toast = document.createElement('div');
      toast.textContent = message + ' (클릭해서 보기)';
      Object.assign(toast.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        background: '#333',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '8px',
        zIndex: '9999',
        cursor: 'pointer',
      });

      toast.onclick = () => {
        console.log('모달 다시 표시:', modals);
        observer.disconnect();
        modals.forEach(m => m.classList.remove('ecko-modal-hidden'));
        toast.remove();
      };

      document.body.appendChild(toast);

      // 자동 사라짐
      setTimeout(() => toast.remove(), 5000);
    }

    function startModalBlock() {
      injectStyle();
      hideModals();
      observer.observe(document.body, { childList: true, subtree: true });
    }

    (async () => {
      if (await getSetting('modalBlockEnabled')) {
        startModalBlock();
      }
    })();
  },
});
