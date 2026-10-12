import { buttonClass } from "@/components/Button";
import type { Pagination as PaginationData } from "@/lib/api";

type PaginationProps = {
  pagination: PaginationData;
  onChange: (page: number) => void;
};

export default function Pagination({ pagination, onChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
      <button className={buttonClass("secondary")} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages} ({total} events)
      </span>
      <button
        className={buttonClass("secondary")}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
