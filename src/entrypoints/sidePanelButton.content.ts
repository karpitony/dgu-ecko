export default defineContentScript({
  matches: ['https://eclass.dongguk.edu/*'],
  main() {
    function sidePanelButtons() {
      const navUser = document.querySelector('.nav.nav-pills.nav-user');
      if (navUser) {
        if (!navUser.querySelector('.nav-item-sidepanel')) {
          const logoutLi = navUser.querySelector('.nav-item-loginout');
          const navItem = document.createElement('li');
          navItem.className = 'nav-item nav-item-sidepanel';
          navItem.style.marginLeft = '15px';

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'btn btn-sm btn-loginout';
          button.innerHTML = `
        <span style="margin-right:8px;" class="menu-name">🐘 이코 열기</span>
      `;
          button.style.backgroundColor = 'oklch(0.623 0.214 259.815)';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.gap = '6px';

          button.onclick = () => {
            console.log('[이코] 사이드패널 열기 버튼 클릭됨');
            chrome.runtime.sendMessage({ action: 'openSidePanel' }, response => {
              if (chrome.runtime.lastError) {
                console.error('[이코] 메시지 전송 실패:', chrome.runtime.lastError);
              } else if (response?.success) {
                console.log('[이코] 사이드패널 열기 성공');
              } else {
                console.error('[이코] 사이드패널 열기 실패:', response?.error);
              }
            });
          };

          navItem.appendChild(button);

          if (logoutLi && logoutLi.nextSibling) {
            navUser.insertBefore(navItem, logoutLi.nextSibling);
          } else {
            navUser.appendChild(navItem);
          }
        }
      }
    }

    sidePanelButtons();
  },
});
