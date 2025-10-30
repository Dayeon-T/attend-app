// src/utils/dateKST.js
// KST(Asia/Seoul) 기준 'YYYY-MM-DD' 계산 유틸

const fmtKST = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// 오늘 일자(한국) 'YYYY-MM-DD'
export const todayKST = () => fmtKST.format(new Date());

// 필요 시: 임의 Date를 KST로 포맷
export const formatDateKST = (d) => fmtKST.format(d);

// 필요 시: 한국 현재 시각의 Date 객체 (벽시계 관점)
export const nowKST = () => {
  const now = new Date();
  // now를 KST 문자열로 만들고 다시 Date로 파싱(날짜 비교용)
  const [y, m, d] = fmtKST.format(now).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)); // 자정 기준 Date가 필요할 때
};
