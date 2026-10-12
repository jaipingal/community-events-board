import type { Metadata } from "next";
import AdminOnly from "@/components/AdminOnly";
import NewEventForm from "@/components/NewEventForm";

export const metadata: Metadata = { title: "New event | Events Board" };

export default function NewEventPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <AdminOnly>
        <NewEventForm />
      </AdminOnly>
    </main>
  );
}
