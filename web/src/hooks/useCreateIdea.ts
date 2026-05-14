import { useState } from "react";
import { createIdea, type Idea } from "../lib/api";

export function useCreateIdea() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(title: string, description: string): Promise<Idea | null> {
    setLoading(true);
    setError(null);
    try {
      const idea = await createIdea(title, description);
      return idea;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar ideia");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
