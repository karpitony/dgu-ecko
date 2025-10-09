/**
 * Promise 관련 유틸리티 함수
 */

/**
 * 주어진 시간 동안 대기하는 Promise를 반환합니다.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Promise에 타임아웃을 추가합니다.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out',
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs)),
  ]);
}

/**
 * Chrome API를 Promise로 래핑합니다.
 */
export function chromeAPIToPromise<T>(
  apiCall: (callback: (result: T) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    apiCall((result: T) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
      } else {
        resolve(result);
      }
    });
  });
}
