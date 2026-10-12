import { Suspense } from "react";
import { getHealth } from "@/lib/api";

async function ApiStatus() {
  const health = await getHealth();
  return <>API status: {health ? "online" : "offline"}</>;
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        Community Events Board
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Discover and share local events.
      </p>
      <p className="text-sm">
        <Suspense fallback="API status: checking...">
          <ApiStatus />
        </Suspense>
      </p>
    </main>
  );
}
