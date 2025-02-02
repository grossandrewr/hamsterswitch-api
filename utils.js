export const validateAlbumsList = content => {
  let contentArray;
  try {
    contentArray = JSON.parse(content);
  } catch (error) {
    throw new Error("Error parsing JSON");
  }

  if (!Array.isArray(contentArray)) {
    throw new Error("Content is not an array");
  } 
  for (const item of contentArray) {
    if (typeof item !== 'object' || !item.hasOwnProperty('album') || !item.hasOwnProperty('artist')) {
      throw new Error("Invalid content format");
    } 
    if (typeof item.album !== 'string' || typeof item.artist !== 'string') {
      throw new Error("Invalid types for album or artist");
    }
  }
}