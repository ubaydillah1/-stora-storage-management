export type FileCategory = "IMAGE" | "DOCUMENT" | "MEDIA" | "OTHER";

export const getNodeCategory = (
  mimeType: string,
  fileName?: string
): FileCategory => {
  const ext = fileName?.split(".").pop()?.toLowerCase() || "";

  if (mimeType.startsWith("image/")) return "IMAGE";
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic"].includes(ext))
    return "IMAGE";

  if (mimeType === "application/pdf") return "DOCUMENT";
  if (
    mimeType.includes("word") ||
    mimeType.includes("excel") ||
    mimeType.includes("presentation")
  )
    return "DOCUMENT";
  if (
    [
      "txt",
      "csv",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "pdf",
      "md",
    ].includes(ext)
  )
    return "DOCUMENT";

  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/"))
    return "MEDIA";
  if (["mp4", "mkv", "mov", "avi", "mp3", "wav", "flac", "m4a"].includes(ext))
    return "MEDIA";

  return "OTHER";
};
