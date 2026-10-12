"use client";

import { buttonClass } from "@/components/Button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        We could not load this page. Please try again.
      </p>
      <button onClick={reset} className={buttonClass("primary")}>
        Try again
      </button>
    </main>
  );
}
