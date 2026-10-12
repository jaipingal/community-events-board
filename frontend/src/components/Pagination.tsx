import type { Pagination as PaginationData } from "@/lib/api";

type PaginationProps = {
  pagination: PaginationData;
  onChange: (page: number) => void;
};

const buttonClass =
  "rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800";

export default function Pagination({ pagination, onChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
      <button className={buttonClass} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages} ({total} events)
      </span>
      <button
        className={buttonClass}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
