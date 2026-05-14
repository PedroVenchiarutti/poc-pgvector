import { prisma } from "../lib/prisma.js";
import { toVectorLiteral } from "../services/embedding.service.js";

export type IdeaRow = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

export type IdeaSearchRow = IdeaRow & {
  similarity: number;
};

// CREATE — Prisma client extension (typed, sem raw)
export async function createIdea(
  title: string,
  description: string,
  embedding: number[]
): Promise<IdeaRow> {
  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      embedding,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
  });
  return idea as IdeaRow;
}

// READ list — Prisma direto, ignora coluna embedding automaticamente
export async function listIdeas(): Promise<IdeaRow[]> {
  return prisma.idea.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// SEARCH por embedding — raw (precisa do score de distancia)
export async function searchIdeasByEmbedding(
  embedding: number[],
  limit = 10
): Promise<IdeaSearchRow[]> {
  const vector = toVectorLiteral(embedding);
  return prisma.$queryRawUnsafe<IdeaSearchRow[]>(
    `SELECT id, title, description, "createdAt",
            1 - (embedding <=> $1::vector) AS similarity
     FROM ideas
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    vector,
    limit
  );
}

// SIMILAR — raw (idem motivo: score)
export async function findSimilarToIdea(
  ideaId: string,
  limit = 10
): Promise<IdeaSearchRow[]> {
  return prisma.$queryRawUnsafe<IdeaSearchRow[]>(
    `SELECT id, title, description, "createdAt",
            1 - (embedding <=> (SELECT embedding FROM ideas WHERE id = $1)) AS similarity
     FROM ideas
     WHERE id != $1
       AND embedding IS NOT NULL
       AND (SELECT embedding FROM ideas WHERE id = $1) IS NOT NULL
     ORDER BY embedding <=> (SELECT embedding FROM ideas WHERE id = $1)
     LIMIT $2`,
    ideaId,
    limit
  );
}

export async function countIdeas(): Promise<number> {
  return prisma.idea.count();
}

export async function truncateIdeas(): Promise<void> {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ideas`);
}
