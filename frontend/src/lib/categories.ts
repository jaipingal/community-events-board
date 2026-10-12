import type { Category } from "./api";

export const categories: { value: Category; label: string }[] = [
  { value: "MUSIC", label: "Music" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "FOOD", label: "Food" },
  { value: "SPORTS", label: "Sports" },
  { value: "KIDS", label: "Kids" },
];

export function categoryLabel(value: string) {
  return categories.find((c) => c.value === value)?.label ?? value;
}
