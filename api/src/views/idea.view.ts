import type { IdeaRow, IdeaSearchRow } from "../models/idea.model.js";

export type IdeaDTO = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type IdeaSearchDTO = IdeaDTO & {
  similarity: number;
  similarityPercent: number;
};

export function toIdeaDTO(row: IdeaRow): IdeaDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toIdeaSearchDTO(row: IdeaSearchRow): IdeaSearchDTO {
  const similarity = Math.max(0, Math.min(1, Number(row.similarity)));
  return {
    ...toIdeaDTO(row),
    similarity,
    similarityPercent: Math.round(similarity * 10000) / 100,
  };
}
