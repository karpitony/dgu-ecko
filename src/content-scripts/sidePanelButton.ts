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
        chrome.runtime.sendMessage({ action: 'openSidePanel' });
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
