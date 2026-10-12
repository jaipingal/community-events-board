import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div
        role="img"
        aria-label={event.title}
        className="aspect-video w-full bg-zinc-200 bg-cover bg-center dark:bg-zinc-800"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium dark:bg-zinc-800">
            {categoryLabel(event.category)}
          </span>
          <span className="font-medium">{formatPrice(event.price)}</span>
        </div>
        <h3 className="font-semibold leading-snug">{event.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {formatDate(event.startsAt)}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {event.city}
        </p>
      </div>
    </Link>
  );
}
