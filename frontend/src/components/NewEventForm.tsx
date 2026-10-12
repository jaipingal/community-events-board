"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField, { inputClass } from "@/components/FormField";
import { ApiError, createEvent } from "@/lib/api";
import { categories } from "@/lib/categories";
import { useAppSelector } from "@/store/hooks";
import { buttonClass } from "@/components/Button";
import Alert from "@/components/Alert";

const emptyForm = {
  title: "",
  category: "",
  city: "",
  startsAt: "",
  price: "",
  imageUrl: "",
  description: "",
};

export default function NewEventForm() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof typeof emptyForm) => (value: string) =>
    setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");

    const missing: Record<string, string> = {};
    if (!form.category) missing.category = "Choose a category";
    if (!form.startsAt) missing.startsAt = "Choose a start date and time";
    if (form.price === "") missing.price = "Enter a price (0 for free)";
    if (Object.keys(missing).length > 0) {
      setFieldErrors(missing);
      return;
    }

    setSubmitting(true);

    try {
      await createEvent(token ?? "", {
        title: form.title,
        category: form.category as (typeof categories)[number]["value"],
        city: form.city,
        startsAt: `${form.startsAt}:00+05:30`,
        price: Number(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
      });
      router.push("/admin/events?created=1");
    } catch (err) {
      if (err instanceof ApiError && err.details.length > 0) {
        const errors: Record<string, string> = {};
        err.details.forEach((d) => (errors[d.field] = d.message));
        setFieldErrors(errors);
      } else {
        setFormError(err instanceof Error ? err.message : "Could not create the event");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold sm:text-3xl">New event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={setField("title")}
          error={fieldErrors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setField("category")(e.target.value)}
              aria-invalid={fieldErrors.category ? true : undefined}
              className={`${inputClass} bg-background`}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {fieldErrors.category ? (
              <p className="text-sm text-red-600">{fieldErrors.category}</p>
            ) : null}
          </div>

          <FormField
            label="City"
            name="city"
            value={form.city}
            onChange={setField("city")}
            error={fieldErrors.city}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Start time (IST)"
            name="startsAt"
            type="datetime-local"
            value={form.startsAt}
            onChange={setField("startsAt")}
            error={fieldErrors.startsAt}
          />
          <FormField
            label="Price (₹)"
            name="price"
            type="number"
            value={form.price}
            onChange={setField("price")}
            error={fieldErrors.price}
          />
        </div>

        <FormField
          label="Image URL"
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={setField("imageUrl")}
          error={fieldErrors.imageUrl}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => setField("description")(e.target.value)}
            aria-invalid={fieldErrors.description ? true : undefined}
            className={inputClass}
          />
          {fieldErrors.description ? (
            <p className="text-sm text-red-600">{fieldErrors.description}</p>
          ) : null}
        </div>

        {formError ? <Alert type="error">{formError}</Alert> : null}

        <button
          type="submit"
          disabled={submitting}
          className={buttonClass("primary")}
        >
          {submitting ? "Creating..." : "Create event"}
        </button>
      </form>
    </div>
  );
}
