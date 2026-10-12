"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useMyReminders } from "@/hooks/useMyReminders";
import { getFavoriteCategories, getFeed } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

export default function FeedList() {
  const token = useAppSelector((state) => state.auth.token) ?? "";
  const [page, setPage] = useState(1);

  const fetchFeed = useCallback(() => getFeed(token, page), [token, page]);
  const fetchFavourites = useCallback(() => getFavoriteCategories(token), [token]);
  const { data, error, loading, reload } = useAsyncData(fetchFeed);
  const favourites = useAsyncData(fetchFavourites);
  const reminders = useMyReminders();

  if (loading || favourites.loading) {
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
    const hasFavourites = (favourites.data?.categories.length ?? 0) > 0;

    return (
      <StatusMessage
        kind="empty"
        title={hasFavourites ? "No upcoming events in your categories" : "Your feed is empty"}
        text={
          hasFavourites
            ? "There is nothing coming up in the categories you picked. Check back soon or add more categories."
            : "Pick your favourite categories and upcoming events from them will show up here."
        }
        action={
          <Link href="/preferences" className="text-sm font-medium underline">
            {hasFavourites ? "Change categories" : "Choose categories"}
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
            <EventCard
              event={event}
              reminded={reminders.isReminded(event.id)}
              remindersLoading={reminders.loading}
            />
          </li>
        ))}
      </ul>
      <Pagination pagination={data.pagination} onChange={setPage} />
    </>
  );
}
