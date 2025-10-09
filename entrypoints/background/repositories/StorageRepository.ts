/**
 * Chrome Storage API 추상화 레이어
 * 타입 안전한 스토리지 접근 제공
 */

import { MAX_CACHE_AGE_MS, MAX_COURSE_ID_CACHE_AGE_MS } from '@/constants/background';

export class StorageRepository {
  /**
   * 스토리지에서 데이터를 가져옵니다.
   */
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    return result[key] ?? null;
  }

  /**
   * 스토리지에 데이터를 저장합니다.
   */
  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }

  /**
   * 스토리지에서 데이터를 삭제합니다.
   */
  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  /**
   * 여러 키의 데이터를 한 번에 가져옵니다.
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T>> {
    const result = await chrome.storage.local.get(keys);
    return result as Record<string, T>;
  }

  /**
   * 캐시된 데이터가 유효한지 확인합니다.
   */
  isCacheValid(fetchedAt: string | undefined, maxAge: number): boolean {
    if (!fetchedAt) return false;

    const now = new Date();
    const cachedTime = new Date(fetchedAt);
    const ageMs = now.getTime() - cachedTime.getTime();

    return ageMs < maxAge;
  }

  /**
   * 강의 ID 캐시가 유효한지 확인합니다.
   */
  isCourseIdCacheValid(fetchedAt: string | undefined): boolean {
    return this.isCacheValid(fetchedAt, MAX_COURSE_ID_CACHE_AGE_MS);
  }

  /**
   * 일반 캐시(VOD/과제)가 유효한지 확인합니다.
   */
  isDataCacheValid(fetchedAt: string | undefined): boolean {
    return this.isCacheValid(fetchedAt, MAX_CACHE_AGE_MS);
  }
}
