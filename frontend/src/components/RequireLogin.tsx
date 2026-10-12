"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import StatusMessage from "@/components/StatusMessage";
import { useAppSelector } from "@/store/hooks";

export default function RequireLogin({ children }: { children: ReactNode }) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <StatusMessage kind="loading" title="Loading..." />;
  }

  if (!user) {
    return (
      <StatusMessage
        kind="error"
        title="Please log in"
        text="You need an account to see this page."
        action={
          <div className="flex gap-4 text-sm font-medium">
            <Link href="/login" className="underline">
              Log in
            </Link>
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        }
      />
    );
  }

  return <>{children}</>;
}
