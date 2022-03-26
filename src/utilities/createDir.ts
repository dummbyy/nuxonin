import { mkdirSync } from "fs";

export const makeDir = (_path: string): void => {
  const dirPath = _path;
  try {
    mkdirSync(dirPath);
  } catch (error) {
    console.error("Error: %d", error);
  }
};
