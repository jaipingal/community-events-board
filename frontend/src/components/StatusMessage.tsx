import type { ReactNode } from "react";

type StatusMessageProps = {
  kind: "loading" | "empty" | "error";
  title: string;
  text?: string;
  action?: ReactNode;
};

export default function StatusMessage({ kind, title, text, action }: StatusMessageProps) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-zinc-300 px-4 py-12 text-center dark:border-zinc-700"
    >
      {kind === "loading" ? (
        <span className="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      ) : null}
      <p className={kind === "error" ? "font-medium text-red-600" : "font-medium"}>{title}</p>
      {text ? <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">{text}</p> : null}
      {action}
    </div>
  );
}
