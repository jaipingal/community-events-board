"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell, BellRing } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getReminder, setReminder } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

export default function ReminderButton({ eventId }: { eventId: number }) {
  const { user, token, loading: authLoading } = useAppSelector((state) => state.auth);

  const fetchReminder = useCallback(
    () => (token ? getReminder(token, eventId) : Promise.resolve({ reminder: false })),
    [token, eventId],
  );
  const saved = useAsyncData(fetchReminder);

  const [override, setOverride] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) return null;

  if (!user || !token) {
    return (
      <Link href="/login" className="text-sm font-medium underline">
        Log in to set a reminder
      </Link>
    );
  }

  const enabled = override ?? saved.data?.reminder ?? false;

  const handleClick = async () => {
    const previous = enabled;
    setError("");
    setOverride(!previous);
    setPending(true);

    try {
      await setReminder(token, eventId, !previous);
    } catch {
      setOverride(previous);
      setError("Could not update your reminder. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={saved.loading || pending}
        aria-pressed={enabled}
        className={
          enabled
            ? "flex w-fit items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            : "flex w-fit items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
        }
      >
        {enabled ? (
          <BellRing className="size-4" aria-hidden="true" />
        ) : (
          <Bell className="size-4" aria-hidden="true" />
        )}
        {enabled ? "Reminder on" : "Remind me"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
