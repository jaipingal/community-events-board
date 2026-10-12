"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

const primaryButton =
  "rounded-md bg-zinc-900 px-5 text-center py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";
const secondaryButton =
  "rounded-md border border-zinc-300 px-5 text-center py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";

export default function HomeActions() {
  const { user, loading } = useAppSelector((state) => state.auth);

  return (
    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
      <Link href="/events" className={primaryButton}>
        Browse events
      </Link>

      {loading ? null : user ? (
        user.role === "ADMIN" ? (
          <Link href="/admin/events" className={secondaryButton}>
            Manage events
          </Link>
        ) : (
          <Link href="/feed" className={secondaryButton}>
            My feed
          </Link>
        )
      ) : (
        <Link href="/signup" className={secondaryButton}>
          Create an account
        </Link>
      )}
    </div>
  );
}
