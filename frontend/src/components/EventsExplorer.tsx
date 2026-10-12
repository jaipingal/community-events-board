"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import EventCard from "@/components/EventCard";
import { inputClass } from "@/components/FormField";
import Pagination from "@/components/Pagination";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useMyReminders } from "@/hooks/useMyReminders";
import { getEventCities, getEvents } from "@/lib/api";
import { categories } from "@/lib/categories";
import { buttonClass } from "@/components/Button";

const PAGE_SIZE = 9;

export default function EventsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchText, setSearchText] = useState(search);

  const updateParams = useCallback(
    (changes: Record<string, string>, keepPage = false) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(changes).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!keepPage) params.delete("page");
      const query = params.toString();
      router.replace(query ? `/events?${query}` : "/events", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (searchText.trim() === search) return;
    const timer = setTimeout(() => updateParams({ search: searchText.trim() }), 400);
    return () => clearTimeout(timer);
  }, [searchText, search, updateParams]);

  const fetchEvents = useCallback(
    () => getEvents({ category, city, search, page, limit: PAGE_SIZE }),
    [category, city, search, page],
  );
  const events = useAsyncData(fetchEvents);
  const cities = useAsyncData(getEventCities);
  const reminders = useMyReminders();

  const clearFilters = () => {
    setSearchText("");
    router.replace("/events", { scroll: false });
  };

  const hasFilters = Boolean(category || city || search);

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {[{ value: "", label: "All" }, ...categories].map((item) => {
            const selected = category.toUpperCase() === item.value;
            return (
              <button
                key={item.label}
                onClick={() => updateParams({ category: item.value })}
                aria-pressed={selected}
                className={
                  selected
                    ? "rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white transition-colors dark:bg-zinc-100 dark:text-zinc-900"
                    : "rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            aria-label="City"
            value={city}
            onChange={(e) => updateParams({ city: e.target.value })}
            className={`${inputClass} bg-background`}
          >
            <option value="">All cities</option>
            {cities.data?.cities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search events"
              placeholder="Search events"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`${inputClass} w-full pl-9 sm:w-64`}
            />
          </div>
        </div>
      </div>

      {events.loading ? (
        <StatusMessage kind="loading" title="Loading events..." />
      ) : events.error ? (
        <StatusMessage
          kind="error"
          title="Could not load events"
          text={events.error}
          onRetry={events.reload}
        />
      ) : events.data && events.data.events.length === 0 ? (
        <StatusMessage
          kind="empty"
          title="No events found"
          text={
            hasFilters
              ? "Nothing matches these filters. Try changing or clearing them."
              : "There are no upcoming events right now. Check back soon."
          }
          action={
            hasFilters ? (
              <button
                onClick={clearFilters}
                className={buttonClass("secondary")}
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : events.data ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.data.events.map((event) => (
              <li key={event.id}>
                <EventCard
                  event={event}
                  reminded={reminders.isReminded(event.id)}
                  remindersLoading={reminders.loading}
                />
              </li>
            ))}
          </ul>
          <Pagination
            pagination={events.data.pagination}
            onChange={(next) => updateParams({ page: String(next) }, true)}
          />
        </>
      ) : null}
    </div>
  );
}
