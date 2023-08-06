import type { SortBy, TrackInfo } from "./radio-entity";

export const APP_URL = "https://al-faidah.com";

export const QUOTA_CREATION = 2;

export type ThemeName =
  | "light"
  | "cupcake"
  | "pastel"
  | "corporate"
  | "lofi"
  | "dracula"
  | "autumn";

export const themes: { name: ThemeName; color: string }[] = [
  { name: "light", color: "bg-gray-300" },
  { name: "cupcake", color: "bg-teal-400" },
  { name: "pastel", color: "bg-purple-200" },
  { name: "corporate", color: "bg-blue-500" },
  { name: "lofi", color: "bg-black" },
  { name: "dracula", color: "bg-slate-600" },
  { name: "autumn", color: "bg-red-700" },
];

export const sortRadios = (radios: TrackInfo[], sortBy: SortBy | undefined) => {
  if (sortBy === "live") {
    return [...radios].sort((a, b) =>
      a.status.toLowerCase() === "live" && b.status.toLowerCase() !== "live"
        ? -1
        : 1
    );
  } else if (sortBy === "most") {
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
