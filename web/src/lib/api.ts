const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export type Idea = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type IdeaSearchResult = Idea & {
  similarity: number;
  similarityPercent: number;
};

export async function fetchIdeas(): Promise<Idea[]> {
  const res = await fetch(`${API_URL}/ideas`);
  if (!res.ok) throw new Error("Erro ao buscar ideias");
  const data = await res.json();
  return data.ideas;
}

export async function searchIdeas(query: string, limit = 10): Promise<IdeaSearchResult[]> {
  const res = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  });
  if (!res.ok) throw new Error("Erro ao buscar similaridade");
  const data = await res.json();
  return data.results;
}

export async function createIdea(title: string, description: string): Promise<Idea> {
  const res = await fetch(`${API_URL}/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro ao criar ideia" }));
    throw new Error(err.error ?? "Erro ao criar ideia");
  }
  const data = await res.json();
  return data.idea;
}
