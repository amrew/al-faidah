import Cookies from "universal-cookie";
import { appConfig } from "./appConfig";

export type ThemeName = "rii" | "rii-dark" | "al-faidah" | "al-faidah-dark";

export const themes: { name: ThemeName; color: string }[] = [
  { name: "rii", color: "bg-red-500" },
  { name: "rii-dark", color: "bg-red-800" },
  { name: "al-faidah", color: "bg-teal-400" },
  { name: "al-faidah-dark", color: "bg-teal-800" },
];

export function getTheme(req: Request) {
  const cookies = new Cookies(req.headers.get("Cookie"));
  const themeName = cookies.get("theme");

  const allowedThemes = [appConfig.theme, appConfig.themeDark];
  const isThemeNameAllowed = allowedThemes.includes(themeName);
  if (isThemeNameAllowed) {
    return themeName;
  }
  return appConfig.theme;
}
