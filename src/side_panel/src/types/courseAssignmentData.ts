export interface Assignment {
  title: string;
  url: string;
  due: string | null; // "-"인 경우 null
  status: string; // 제출 완료, 미제출 등
}