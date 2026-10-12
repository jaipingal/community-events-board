"use client";

import { useCallback, useState } from "react";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getFavoriteCategories, saveFavoriteCategories, type Category } from "@/lib/api";
import { categories } from "@/lib/categories";
import { useAppSelector } from "@/store/hooks";
import { buttonClass } from "@/components/Button";
import Alert from "@/components/Alert";

export default function PreferencesForm() {
  const token = useAppSelector((state) => state.auth.token) ?? "";

  const fetchSaved = useCallback(() => getFavoriteCategories(token), [token]);
  const saved = useAsyncData(fetchSaved);

  const [edited, setEdited] = useState<Category[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  if (saved.loading) {
    return <StatusMessage kind="loading" title="Loading your preferences..." />;
  }

  if (saved.error || !saved.data) {
    return (
      <StatusMessage
        kind="error"
        title="Could not load your preferences"
        text={saved.error}
        onRetry={saved.reload}
      />
    );
  }

  const selected = edited ?? saved.data.categories;

  const toggle = (value: Category) => {
    setMessage(null);
    setEdited(
      selected.includes(value) ? selected.filter((c) => c !== value) : [...selected, value],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const result = await saveFavoriteCategories(token, selected);
      setEdited(result.categories);
      setMessage({ type: "success", text: "Your preferences have been saved." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Could not save your preferences",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3" role="group" aria-label="Favourite categories">
        {categories.map((item) => {
          const isSelected = selected.includes(item.value);
          return (
            <button
              key={item.value}
              onClick={() => toggle(item.value)}
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition duration-150 motion-safe:active:scale-95 dark:bg-zinc-100 dark:text-zinc-900"
                  : "rounded-full border border-zinc-300 px-5 py-2 text-sm transition duration-150 hover:bg-zinc-100 motion-safe:active:scale-95 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {message ? <Alert type={message.type}>{message.text}</Alert> : null}

      <button
        onClick={handleSave}
        disabled={saving}
        className={buttonClass("primary", "w-full sm:w-fit")}
      >
        {saving ? "Saving..." : "Save preferences"}
      </button>
    </div>
  );
}
