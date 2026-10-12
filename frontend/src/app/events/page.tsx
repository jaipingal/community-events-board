import type { Metadata } from "next";
import { Suspense } from "react";
import EventsExplorer from "@/components/EventsExplorer";
import StatusMessage from "@/components/StatusMessage";

export const metadata: Metadata = { title: "Events | Events Board" };

export default function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">Upcoming events</h1>
      <Suspense fallback={<StatusMessage kind="loading" title="Loading events..." />}>
        <EventsExplorer />
      </Suspense>
    </main>
  );
}
