


const fmtKST = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});


export const todayKST = () => fmtKST.format(new Date());


export const formatDateKST = (d) => fmtKST.format(d);


export const nowKST = () => {
  const now = new Date();
  
  const [y, m, d] = fmtKST.format(now).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)); 
};
