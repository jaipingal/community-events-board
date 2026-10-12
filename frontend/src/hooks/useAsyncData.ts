import { useEffect, useState } from "react";

type Result<T> = {
  fetcher: () => Promise<T>;
  version: number;
  data?: T;
  error?: string;
};

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ fetcher, version, data });
      })
      .catch((err: Error) => {
        if (!cancelled) setResult({ fetcher, version, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, version]);

  const current = result?.fetcher === fetcher && result.version === version;

  return {
    data: current ? result.data : undefined,
    error: current ? result.error : undefined,
    loading: !current,
    reload: () => setVersion((v) => v + 1),
  };
}
