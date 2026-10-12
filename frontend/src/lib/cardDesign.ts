export const MAX_STICKERS = 3;

export const themes = [
  { key: "sunset", label: "Sunset", gradient: "bg-linear-to-br from-orange-400 to-pink-600" },
  { key: "ocean", label: "Ocean", gradient: "bg-linear-to-br from-sky-400 to-indigo-700" },
  { key: "forest", label: "Forest", gradient: "bg-linear-to-br from-emerald-400 to-teal-800" },
] as const;

export const stickers = [
  { key: "star", label: "Star", emoji: "⭐" },
  { key: "heart", label: "Heart", emoji: "❤️" },
  { key: "fire", label: "Fire", emoji: "🔥" },
  { key: "music", label: "Music", emoji: "🎵" },
  { key: "party", label: "Party", emoji: "🎉" },
] as const;

export type ThemeKey = (typeof themes)[number]["key"];
export type StickerKey = (typeof stickers)[number]["key"];

export type CardDesign = {
  theme: ThemeKey;
  stickers: StickerKey[];
};

export const defaultDesign: CardDesign = { theme: "sunset", stickers: [] };

export function stickerEmoji(key: string) {
  return stickers.find((s) => s.key === key)?.emoji ?? "";
}
