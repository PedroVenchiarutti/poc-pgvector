import {
  createIdea,
  findSimilarToIdea,
  listIdeas,
  searchIdeasByEmbedding,
} from "../models/idea.model.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { toIdeaDTO, toIdeaSearchDTO, type IdeaDTO, type IdeaSearchDTO } from "../views/idea.view.js";

export async function getAllIdeas(): Promise<IdeaDTO[]> {
  const rows = await listIdeas();
  return rows.map(toIdeaDTO);
}

export async function searchIdeas(query: string, limit = 10): Promise<IdeaSearchDTO[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }
  const embedding = await generateEmbedding(query);
  const rows = await searchIdeasByEmbedding(embedding, limit);
  return rows.map(toIdeaSearchDTO);
}

export async function createNewIdea(title: string, description: string): Promise<IdeaDTO> {
  const text = `${title}. ${description}`;
  const embedding = await generateEmbedding(text);
  const row = await createIdea(title, description, embedding);
  return toIdeaDTO(row);
}

export async function getSimilarIdeas(ideaId: string, limit = 10): Promise<IdeaSearchDTO[]> {
  const rows = await findSimilarToIdea(ideaId, limit);
  return rows.map(toIdeaSearchDTO);
}
