"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell, BellRing } from "lucide-react";
import { buttonClass } from "@/components/Button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getReminder, setReminder } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

type ReminderButtonProps = {
  eventId: number;
  initial?: boolean;
  loading?: boolean;
  compact?: boolean;
};

export default function ReminderButton({
  eventId,
  initial,
  loading = false,
  compact = false,
}: ReminderButtonProps) {
  const { user, token, loading: authLoading } = useAppSelector((state) => state.auth);

  const fetchReminder = useCallback(() => {
    if (!token || loading || initial !== undefined) {
      return Promise.resolve({ reminder: initial ?? false });
    }
    return getReminder(token, eventId);
  }, [token, eventId, initial, loading]);
  const saved = useAsyncData(fetchReminder);

  const [override, setOverride] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) return null;

  if (!user || !token) {
    return compact ? (
      <Link href="/login" className={buttonClass("secondary", "", "sm")}>
        <Bell className="size-4" aria-hidden="true" />
        Remind me
      </Link>
    ) : (
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
        disabled={loading || saved.loading || pending}
        aria-pressed={enabled}
        className={buttonClass(enabled ? "primary" : "secondary", "w-fit", compact ? "sm" : "md")}
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
