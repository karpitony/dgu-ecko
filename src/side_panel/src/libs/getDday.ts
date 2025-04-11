export function getDday(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr.replace(' ', 'T'));
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
