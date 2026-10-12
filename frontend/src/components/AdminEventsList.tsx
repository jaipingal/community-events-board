"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StatusMessage from "@/components/StatusMessage";
import Pagination from "@/components/Pagination";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getAdminEvents, setEventStatus } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { useAppSelector } from "@/store/hooks";
import { buttonClass } from "@/components/Button";
import Alert from "@/components/Alert";

export default function AdminEventsList() {
  const token = useAppSelector((state) => state.auth.token);
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const justCreated = useSearchParams().get("created") === "1";

  const fetchEvents = useCallback(() => getAdminEvents(token ?? "", page), [token, page]);
  const { data, error, loading, reload } = useAsyncData(fetchEvents);

  const handleToggle = async (id: number, title: string, isActive: boolean) => {
    setActionMessage(null);
    setPendingId(id);

    try {
      await setEventStatus(token ?? "", id, isActive);
      setActionMessage({
        type: "success",
        text: `"${title}" is now ${isActive ? "active" : "inactive"}.`,
      });
      reload();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Could not update the event",
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Manage events</h1>
        <Link
          href="/admin/events/new"
          className={buttonClass("primary")}
        >
          New event
        </Link>
      </div>

      {actionMessage ? (
        <Alert type={actionMessage.type}>{actionMessage.text}</Alert>
      ) : justCreated ? (
        <Alert type="success">The event was created.</Alert>
      ) : null}

      {loading ? (
        <StatusMessage kind="loading" title="Loading events..." />
      ) : error || !data ? (
        <StatusMessage
          kind="error"
          title="Could not load events"
          text={error}
          onRetry={reload}
        />
      ) : data.events.length === 0 ? (
        <StatusMessage
          kind="empty"
          title="No events yet"
          text="Create the first event to get started."
        />
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {data.events.map((event) => {
              const isPast = new Date(event.startsAt) < new Date();
              return (
                <li
                  key={event.id}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-zinc-900/40"
                >
                  <div className="flex flex-col gap-1">
                    <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                      {event.title}
                    </Link>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {categoryLabel(event.category)} &middot; {event.city} &middot;{" "}
                      {formatDate(event.startsAt)} &middot; {formatPrice(event.price)}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span
                        className={
                          event.isActive
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-green-800 dark:bg-green-950 dark:text-green-300"
                            : "rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }
                      >
                        {event.isActive ? "Active" : "Inactive"}
                      </span>
                      {isPast ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Past
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(event.id, event.title, !event.isActive)}
                    disabled={pendingId === event.id}
                    className={buttonClass("secondary")}
                  >
                    {pendingId === event.id
                      ? "Saving..."
                      : event.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </li>
              );
            })}
          </ul>
          <Pagination pagination={data.pagination} onChange={setPage} />
        </>
      )}
    </div>
  );
}
