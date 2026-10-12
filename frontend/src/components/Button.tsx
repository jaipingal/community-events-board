type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition duration-150 motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
  secondary:
    "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2",
  sm: "px-3 py-1.5",
};

export function buttonClass(variant: Variant = "primary", extra = "", size: Size = "md") {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}
