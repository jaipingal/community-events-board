"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import type { AuthError } from "@/store/authSlice";
import { handleSignup } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { buttonClass } from "@/components/Button";
import Alert from "@/components/Alert";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      await dispatch(handleSignup({ name, email, password })).unwrap();
      router.push("/events");
    } catch (err) {
      const { message, details } = err as AuthError;
      const errors: Record<string, string> = {};
      details.forEach((d) => (errors[d.field] = d.message));
      setFieldErrors(errors);
      if (details.length === 0) setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-8 sm:max-w-md sm:py-12 lg:py-16">
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={setName}
          error={fieldErrors.name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />

        {formError ? <Alert type="error">{formError}</Alert> : null}

        <button
          type="submit"
          disabled={submitting}
          className={buttonClass("primary")}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
