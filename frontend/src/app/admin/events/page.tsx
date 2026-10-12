import AdminEventsList from "@/components/AdminEventsList";
import AdminOnly from "@/components/AdminOnly";

export default function AdminEventsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminOnly>
        <AdminEventsList />
      </AdminOnly>
    </main>
  );
}
