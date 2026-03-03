import { getSetting } from '@/libs/settings';

const STORAGE_KEY = 'ecko_notification_base';

export default defineContentScript({
  matches: ['https://eclass.dongguk.edu/*'],
  registration: 'manifest',
  main() {
    /** storage에서 base 값 읽기 */
    function getBase(): Promise<number> {
      return new Promise(resolve => {
        chrome.storage.local.get(STORAGE_KEY, result => {
          resolve(result[STORAGE_KEY] ?? 0);
        });
      });
    }

    /** storage에 base 값 저장 */
    function setBase(value: number): Promise<void> {
      return new Promise(resolve => {
        chrome.storage.local.set({ [STORAGE_KEY]: value }, () => resolve());
      });
    }

    /** 배지 요소 찾기 */
    function findBadge(): HTMLSpanElement | null {
      return document.querySelector('.nav-item-userinfo .picture-badge .badge');
    }

    /** 서버에서 표시 중인 원본 알림 수 가져오기 */
    function getServerCount(badge: HTMLSpanElement): number {
      // data-original 속성에 원본 값을 보관 (최초 1회)
      const original = badge.getAttribute('data-ecko-original');
      if (original !== null) {
        return parseInt(original, 10) || 0;
      }

      const count = parseInt(badge.textContent?.trim() || '0', 10) || 0;
      badge.setAttribute('data-ecko-original', String(count));
      return count;
    }

    /** 배지 업데이트 */
    async function updateBadge(badge: HTMLSpanElement) {
      const serverCount = getServerCount(badge);
      const base = await getBase();

      // 서버 값이 0이거나 base보다 작으면 → 버그 수정된 상태, base 리셋
      if (serverCount === 0 || serverCount < base) {
        await setBase(0);
        badge.style.display = '';
        badge.removeAttribute('data-ecko-original');
        return;
      }

      const delta = serverCount - base;

      if (delta <= 0) {
        // 새 알림 없음 → 배지 숨김
        badge.style.display = 'none';
      } else {
        // 새 알림만 표시
        badge.textContent = String(delta);
        badge.style.display = '';
      }
    }

    /** 알림 확인(클릭) 시 base 갱신 */
    function attachClickHandler(badge: HTMLSpanElement) {
      const userInfoBtn = document.querySelector<HTMLButtonElement>(
        '.nav-item-userinfo .btn-userinfo',
      );

      if (!userInfoBtn || userInfoBtn.hasAttribute('data-ecko-badge-listener')) return;

      userInfoBtn.setAttribute('data-ecko-badge-listener', 'true');
      userInfoBtn.addEventListener('click', async () => {
        const serverCount = getServerCount(badge);
        await setBase(serverCount);
        badge.style.display = 'none';
        console.log(`[이코] 알림 배지 base 갱신: ${serverCount}`);
      });
    }

    /** 메인 처리 */
    async function processBadge() {
      const badge = findBadge();
      if (!badge) return;

      await updateBadge(badge);
      attachClickHandler(badge);
    }

    /** MutationObserver로 DOM 변경 감시 */
    function startObserver() {
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      const observer = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => processBadge(), 300);
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    // 진입점
    (async () => {
      if (!(await getSetting('notificationBadgeFixEnabled'))) return;

      // DOM 준비 대기
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          processBadge();
          startObserver();
        });
      } else {
        await processBadge();
        startObserver();
      }

      console.log('[이코] 알림 배지 보정 활성화');
    })();
  },
});
