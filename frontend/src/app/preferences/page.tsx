import PreferencesForm from "@/components/PreferencesForm";
import RequireLogin from "@/components/RequireLogin";

export default function PreferencesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">Your preferences</h1>
      <p className="mt-2 mb-6 text-zinc-600 dark:text-zinc-400">
        Choose the categories you like. Your feed will show upcoming events from them.
      </p>
      <RequireLogin>
        <PreferencesForm />
      </RequireLogin>
    </main>
  );
}
