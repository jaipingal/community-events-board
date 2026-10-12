import Link from "next/link";
import { buttonClass } from "@/components/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-5xl font-semibold">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/events" className={buttonClass("primary")}>
        Browse events
      </Link>
    </main>
  );
}
