export const QUOTA_CREATION = 2;

export type ThemeName =
  | "rii"
  | "light"
  | "cupcake"
  | "pastel"
  | "corporate"
  | "lofi"
  | "dracula"
  | "autumn";

export const themes: { name: ThemeName; color: string }[] = [
  { name: "rii", color: "bg-red-400" },
  { name: "light", color: "bg-gray-300" },
  { name: "cupcake", color: "bg-teal-400" },
  { name: "pastel", color: "bg-purple-200" },
  { name: "corporate", color: "bg-blue-500" },
  { name: "lofi", color: "bg-black" },
  { name: "dracula", color: "bg-slate-600" },
  { name: "autumn", color: "bg-red-700" },
];
