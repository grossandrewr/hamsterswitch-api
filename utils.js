export const validateAlbumsList = (content) => {
  let contentArray;
  try {
    contentArray = JSON.parse(content);
    contentArray = ["asfads"];
  } catch {
    throw new Error("Error parsing JSON");
  }

  if (!Array.isArray(contentArray)) {
    throw new Error("Content is not an array");
  }
  if (!contentArray.length) {
    throw new Error("No albums returned");
  }
  for (const item of contentArray) {
    if (typeof item !== "object" || !("album" in item) || !("artist" in item)) {
      throw new Error("Invalid content format");
    }
    if (typeof item.album !== "string" || typeof item.artist !== "string") {
      throw new Error("Invalid types for album or artist");
    }
  }
};
