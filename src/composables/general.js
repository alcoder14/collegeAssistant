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
