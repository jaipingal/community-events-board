"use client";

import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { useAppSelector } from "@/store/hooks";

export default function HomeActions() {
  const { user, loading } = useAppSelector((state) => state.auth);

  return (
    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
      <Link href="/events" className={buttonClass("primary")}>
        Browse events
      </Link>

      {loading ? null : user ? (
        user.role === "ADMIN" ? (
          <Link href="/admin/events" className={buttonClass("secondary")}>
            Manage events
          </Link>
        ) : (
          <Link href="/feed" className={buttonClass("secondary")}>
            My feed
          </Link>
        )
      ) : (
        <Link href="/signup" className={buttonClass("secondary")}>
          Create an account
        </Link>
      )}
    </div>
  );
}
