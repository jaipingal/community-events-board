import FeedList from "@/components/FeedList";
import RequireLogin from "@/components/RequireLogin";

export default function FeedPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold sm:text-3xl">My feed</h1>
      <RequireLogin>
        <FeedList />
      </RequireLogin>
    </main>
  );
}
