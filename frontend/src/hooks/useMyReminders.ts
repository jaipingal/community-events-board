import { useCallback } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getMyReminders } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

export function useMyReminders() {
  const token = useAppSelector((state) => state.auth.token);

  const fetchReminders = useCallback(
    () => (token ? getMyReminders(token) : Promise.resolve({ eventIds: [] as number[] })),
    [token],
  );
  const { data, loading } = useAsyncData(fetchReminders);

  return {
    loading,
    isReminded: (eventId: number) => (data ? data.eventIds.includes(eventId) : undefined),
  };
}
