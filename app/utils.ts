import type { TrackInfo } from "./radio/entity";

export const APP_URL = "https://al-faidah.com";

export type ThemeName =
  | "cupcake"
  | "pastel"
  | "corporate"
  | "lofi"
  | "dracula"
  | "autumn";

export const themes: { name: ThemeName; color: string }[] = [
  { name: "cupcake", color: "bg-teal-400" },
  { name: "pastel", color: "bg-purple-200" },
  { name: "corporate", color: "bg-blue-500" },
  { name: "lofi", color: "bg-black" },
  { name: "dracula", color: "bg-slate-600" },
  { name: "autumn", color: "bg-red-700" },
];

export const sortRadios = (
  radios: TrackInfo[],
  sortBy: "most" | "less" | "default" | undefined
) => {
  if (sortBy === "most") {
    return [...radios].sort((a, b) =>
      a.listenerCount > b.listenerCount ? -1 : 1
    );
  } else if (sortBy === "less") {
    return [...radios].sort((a, b) =>
      a.listenerCount < b.listenerCount ? -1 : 1
    );
  } else {
    return radios;
  }
};
