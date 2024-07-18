import type { PostStatus } from "@apiTypes";
import type { ThemeMode } from "@types";

export const postStatusBgColors = (
  status: PostStatus,
  themeMode: ThemeMode
) => {
  const modes: Record<ThemeMode, string> = {
    sunny: "dark",
    sunset: "main",
    "pitch black": "main",
  };

  const statuses: Record<PostStatus, (mode: ThemeMode) => string> = {
    Draft: (mode: ThemeMode) => `warning.${modes[mode]}`,
    Published: (mode: ThemeMode) => `success.${modes[mode]}`,
    Unpublished: (mode: ThemeMode) => `info.${modes[mode]}`,
  };

  return statuses[status](themeMode);
};
