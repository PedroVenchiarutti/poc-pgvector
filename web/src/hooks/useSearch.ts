import { useEffect, useState } from "react";
import { searchIdeas, type IdeaSearchResult } from "../lib/api";

export function useSearch(query: string, debounceMs = 350) {
  const [results, setResults] = useState<IdeaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const handle = setTimeout(async () => {
      try {
        const data = await searchIdeas(query);
        if (!cancelled) setResults(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erro");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, debounceMs]);

  return { results, loading, error };
}
