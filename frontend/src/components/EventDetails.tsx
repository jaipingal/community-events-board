"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import CardDesigner from "@/components/CardDesigner";
import ReminderButton from "@/components/ReminderButton";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getEvent } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { buttonClass } from "@/components/Button";

export default function EventDetails() {
  const params = useParams<{ id: string }>();
  const fetchEvent = useCallback(() => getEvent(params.id), [params.id]);
  const { data, error, loading, reload } = useAsyncData(fetchEvent);

  if (loading) {
    return <StatusMessage kind="loading" title="Loading event..." />;
  }

  if (error || !data) {
    return (
      <StatusMessage
        kind="error"
        title="Could not load this event"
        text={error}
        action={
          <div className="flex gap-3">
            <button
              onClick={reload}
              className={buttonClass("secondary")}
            >
              Try again
            </button>
            <Link href="/events" className="rounded-md px-4 py-2 text-sm underline">
              Back to events
            </Link>
          </div>
        }
      />
    );
  }

  const { event } = data;

  return (
    <article className="flex flex-col gap-6">
      <Link href="/events" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
        &larr; Back to events
      </Link>

      <div
        role="img"
        aria-label={event.title}
        className="aspect-video w-full rounded-lg bg-zinc-200 bg-cover bg-center dark:bg-zinc-800"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />

      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-zinc-100 px-3 py-0.5 text-sm font-medium dark:bg-zinc-800">
          {categoryLabel(event.category)}
        </span>
        <h1 className="text-2xl font-semibold sm:text-3xl">{event.title}</h1>

        <div className="flex flex-col gap-2 text-zinc-700 sm:flex-row sm:flex-wrap sm:gap-6 dark:text-zinc-300">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-5" aria-hidden="true" />
            {formatDate(event.startsAt)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-5" aria-hidden="true" />
            {event.city}
          </p>
          <p className="font-medium">{formatPrice(event.price)}</p>
        </div>

        <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {event.description}
        </p>

        <ReminderButton eventId={event.id} />
      </div>

      <CardDesigner event={event} />
    </article>
  );
}
