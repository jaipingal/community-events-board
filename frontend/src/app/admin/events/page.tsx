import type { Metadata } from "next";
import { Suspense } from "react";
import AdminEventsList from "@/components/AdminEventsList";
import AdminOnly from "@/components/AdminOnly";
import StatusMessage from "@/components/StatusMessage";

export const metadata: Metadata = { title: "Manage events | Events Board" };

export default function AdminEventsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminOnly>
        <Suspense fallback={<StatusMessage kind="loading" title="Loading events..." />}>
          <AdminEventsList />
        </Suspense>
      </AdminOnly>
    </main>
  );
}
