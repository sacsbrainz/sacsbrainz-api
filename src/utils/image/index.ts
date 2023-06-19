import fs from "fs";

// convert byte to mb
export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// get file size
export const getFileSize = (filePath: string) => {
  const file = fs.statSync(filePath);
  return `${formatBytes(file.size)}`;
};
