import { useEffect, useState } from "react";
import { fetchSimilarIdeas, type IdeaSearchResult } from "../lib/api";

export function useSimilarIdeas(ideaId: string | null) {
  const [results, setResults] = useState<IdeaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ideaId) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSimilarIdeas(ideaId)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erro");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ideaId]);

  return { results, loading, error };
}
