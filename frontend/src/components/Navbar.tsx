"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleLogout } from "@/store/authSlice";

export default function Navbar() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogoutClick = () => {
    dispatch(handleLogout());
    router.push("/");
  };

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold">
          Events Board
        </Link>

        <div className="flex items-center gap-2 text-sm sm:gap-4">
          <Link href="/events" className="hover:underline">
            Events
          </Link>
          {loading ? null : user ? (
            <>
              <Link href="/feed" className="hover:underline">
                My feed
              </Link>
              <Link href="/preferences" className="hidden hover:underline sm:inline">
                Preferences
              </Link>
              {user.role === "ADMIN" ? (
                <Link href="/admin/events" className="hover:underline">
                  Manage events
                </Link>
              ) : null}
              <span className="hidden max-w-[12rem] truncate text-zinc-600 sm:inline dark:text-zinc-400">
                {user.name}
                {user.role === "ADMIN" ? " (admin)" : ""}
              </span>
              <button
                onClick={handleLogoutClick}
                className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
