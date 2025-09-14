export default defineContentScript({
  registration: 'runtime',
  main() {
    function removeModals() {
      document.querySelectorAll('.modal.notice_popup').forEach(el => el.remove());
      document.querySelectorAll('[id^="notice_popup_31_"]').forEach(el => el.remove());
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }

    function startModalBlock() {
      removeModals();
      const observer = new MutationObserver(removeModals);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    chrome.storage.sync.get(['modalBlockEnabled'], result => {
      if (result.modalBlockEnabled) {
        startModalBlock();
      }
    });
  },
});
