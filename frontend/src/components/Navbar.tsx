"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/Button";
import { handleLogout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const linkClass =
  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";

export default function Navbar() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = () => {
    closeMenu();
    dispatch(handleLogout());
    router.push("/");
  };

  const links = (
    <>
      <Link href="/events" className={linkClass} onClick={closeMenu}>
        Events
      </Link>
      {user ? (
        <>
          <Link href="/feed" className={linkClass} onClick={closeMenu}>
            My feed
          </Link>
          <Link href="/preferences" className={linkClass} onClick={closeMenu}>
            Preferences
          </Link>
          {user.role === "ADMIN" ? (
            <Link href="/admin/events" className={linkClass} onClick={closeMenu}>
              Manage events
            </Link>
          ) : null}
        </>
      ) : null}
    </>
  );

  const account = loading ? null : user ? (
    <>
      <span className="max-w-[12rem] truncate px-3 text-sm text-zinc-600 dark:text-zinc-400">
        {user.name}
        {user.role === "ADMIN" ? " (admin)" : ""}
      </span>
      <button onClick={handleLogoutClick} className={buttonClass("secondary", "", "sm")}>
        Log out
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className={linkClass} onClick={closeMenu}>
        Log in
      </Link>
      <Link
        href="/signup"
        className={buttonClass("primary", "", "sm")}
        onClick={closeMenu}
      >
        Sign up
      </Link>
    </>
  );

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold" onClick={closeMenu}>
          Events Board
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links}
          <span className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          {account}
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-md p-2 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {menuOpen ? (
        <div className="flex flex-col gap-1 border-t border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          {links}
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            {account}
          </div>
        </div>
      ) : null}
    </header>
  );
}
