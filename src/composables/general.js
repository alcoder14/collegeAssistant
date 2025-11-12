export const transformDate = (dateString) => {
  // Split the input by dashes
  const [year, month, day] = dateString.split('-');
  
  // Return in the desired format
  return `${day}. ${month}. ${year}`;
}
