"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import StatusMessage from "@/components/StatusMessage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getCardDesign, saveCardDesign, type Event } from "@/lib/api";
import {
  defaultDesign,
  MAX_STICKERS,
  stickerEmoji,
  stickers,
  themes,
  type CardDesign,
  type StickerKey,
  type ThemeKey,
} from "@/lib/cardDesign";
import { formatDate } from "@/lib/format";
import { useAppSelector } from "@/store/hooks";

export default function CardDesigner({ event }: { event: Event }) {
  const { user, token, loading: authLoading } = useAppSelector((state) => state.auth);

  const fetchDesign = useCallback(
    () => (token ? getCardDesign(token, event.id) : Promise.resolve({ design: null })),
    [token, event.id],
  );
  const saved = useAsyncData(fetchDesign);

  const [draft, setDraft] = useState<CardDesign | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  if (authLoading) return null;

  if (!user || !token) {
    return (
      <section className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-xl font-semibold">Design your card</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-medium underline">
            Log in
          </Link>{" "}
          to design a card for this event.
        </p>
      </section>
    );
  }

  if (saved.loading) {
    return <StatusMessage kind="loading" title="Loading your card design..." />;
  }

  if (saved.error) {
    return (
      <StatusMessage
        kind="error"
        title="Could not load your card design"
        text={saved.error}
        action={
          <button
            onClick={saved.reload}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Try again
          </button>
        }
      />
    );
  }

  const design: CardDesign = draft ?? saved.data?.design ?? defaultDesign;
  const limitReached = design.stickers.length >= MAX_STICKERS;

  const update = (next: CardDesign) => {
    setMessage(null);
    setDraft(next);
  };

  const handleTheme = (theme: ThemeKey) => update({ ...design, theme });

  const handleAddSticker = (key: StickerKey) => {
    if (limitReached) return;
    update({ ...design, stickers: [...design.stickers, key] });
  };

  const handleRemoveSticker = (index: number) => {
    update({ ...design, stickers: design.stickers.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const result = await saveCardDesign(token, event.id, design);
      setDraft(result.design);
      setMessage({ type: "success", text: "Your card design has been saved." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Could not save your design",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-5 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <h2 className="text-xl font-semibold">Design your card</h2>

      <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-xl text-white shadow-md">
        {themes.map((theme) => (
          <div
            key={theme.key}
            className={`absolute inset-0 transition-opacity duration-500 ${theme.gradient} ${
              theme.key === design.theme ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="relative flex h-full flex-col justify-between p-5">
          <div>
            <p className="text-lg font-semibold leading-snug sm:text-2xl">{event.title}</p>
            <p className="mt-1 text-sm text-white/90">{formatDate(event.startsAt)}</p>
            <p className="text-sm text-white/90">{event.city}</p>
          </div>

          <div className="flex min-h-12 gap-2 text-4xl sm:text-5xl">
            {design.stickers.map((key, index) => (
              <span key={`${index}-${key}`} className="sticker-pop" aria-hidden="true">
                {stickerEmoji(key)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Theme</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Theme">
          {themes.map((theme) => (
            <button
              key={theme.key}
              onClick={() => handleTheme(theme.key)}
              aria-pressed={theme.key === design.theme}
              className={
                theme.key === design.theme
                  ? "rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          Stickers ({design.stickers.length}/{MAX_STICKERS})
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Add a sticker">
          {stickers.map((sticker) => (
            <button
              key={sticker.key}
              onClick={() => handleAddSticker(sticker.key)}
              disabled={limitReached}
              aria-label={`Add ${sticker.label} sticker`}
              className="rounded-md border border-zinc-300 px-3 py-2 text-2xl hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              {sticker.emoji}
            </button>
          ))}
        </div>
        {limitReached ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You can add up to {MAX_STICKERS} stickers. Remove one to add another.
          </p>
        ) : null}

        {design.stickers.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-2">
            {design.stickers.map((key, index) => (
              <li key={`${index}-${key}`}>
                <button
                  onClick={() => handleRemoveSticker(index)}
                  aria-label={`Remove ${key} sticker`}
                  className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  <span aria-hidden="true">{stickerEmoji(key)}</span>
                  <X className="size-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {message ? (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={
            message.type === "error"
              ? "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              : "rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300"
          }
        >
          {message.text}
        </p>
      ) : null}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60 sm:w-fit dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {saving ? "Saving..." : "Save design"}
      </button>
    </section>
  );
}
