"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import StatusMessage from "@/components/StatusMessage";
import { useAppSelector } from "@/store/hooks";

export default function AdminOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <StatusMessage kind="loading" title="Checking your access..." />;
  }

  if (!user) {
    return (
      <StatusMessage
        kind="error"
        title="Please log in"
        text="You need to log in as an admin to see this page."
        action={
          <Link href="/login" className="text-sm font-medium underline">
            Go to login
          </Link>
        }
      />
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <StatusMessage
        kind="error"
        title="Admin access required"
        text="Your account does not have permission to view this page."
      />
    );
  }

  return <>{children}</>;
}
