export const transformDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}. ${month}. ${year}`;
}

export const generateDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  
  return formattedDate;
}

export const generateTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
}

export const compareDateToToday = (dateStr) => {
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  const inputDate = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (inputDate.getTime() === today.getTime()) return "today";
  return inputDate < today ? "past" : "future";
};
