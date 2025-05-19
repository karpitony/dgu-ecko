export function getDday(dateStr: string): number {
  if (!dateStr) return Infinity;

  // ISO 8601 형식으로 변환
  const isoString = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const target = new Date(isoString);

  if (isNaN(target.getTime())) {
    console.warn(`Invalid date: ${dateStr}`);
    return Infinity; // 날짜 파싱 실패 시 무한으로 처리
  }

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
