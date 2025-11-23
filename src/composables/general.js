export const transformDate = (dateString) => {
  // Split the input by dashes
  const [year, month, day] = dateString.split('-');
  
  // Return in the desired format
  return `${day}. ${month}. ${year}`;
}
export const transformDateBack = (dateString) => {
  // Split by dot + space
  const [day, month, year] = dateString.split('. ').map(part => part.trim());

  // Return in the desired format
  return `${year}-${month}-${day}`;
};
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
  // Split the input string "dd. mm. yyyy"
  const [dd, mm, yyyy] = dateStr.split('.').map(Number);
  // Create a Date object for the input (months are 0-indexed)
  const inputDate = new Date(yyyy, mm - 1, dd);

  // Get today's date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time to midnight

  // Compare
  if (inputDate.getTime() === today.getTime()) return "today";
  return inputDate < today ? "past" : "future";
};
