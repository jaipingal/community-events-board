"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getFeed } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

export default function FeedList() {
  const token = useAppSelector((state) => state.auth.token) ?? "";
  const [page, setPage] = useState(1);

  const fetchFeed = useCallback(() => getFeed(token, page), [token, page]);
  const { data, error, loading, reload } = useAsyncData(fetchFeed);

  if (loading) {
    return <StatusMessage kind="loading" title="Loading your feed..." />;
  }

  if (error || !data) {
    return (
      <StatusMessage
        kind="error"
        title="Could not load your feed"
        text={error}
        onRetry={reload}
      />
    );
  }

  if (data.events.length === 0) {
    return (
      <StatusMessage
        kind="empty"
        title="Nothing in your feed yet"
        text="Pick your favourite categories and upcoming events that match will show up here."
        action={
          <Link href="/preferences" className="text-sm font-medium underline">
            Choose categories
          </Link>
        }
      />
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
      <Pagination pagination={data.pagination} onChange={setPage} />
    </>
  );
}
