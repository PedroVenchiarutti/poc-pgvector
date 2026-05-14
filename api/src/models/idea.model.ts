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

export async function createIdea(
  title: string,
  description: string,
  embedding: number[]
): Promise<IdeaRow> {
  const vector = toVectorLiteral(embedding);
  const rows = await prisma.$queryRawUnsafe<IdeaRow[]>(
    `INSERT INTO ideas (id, title, description, embedding, "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3::vector, NOW())
     RETURNING id, title, description, "createdAt"`,
    title,
    description,
    vector
  );
  return rows[0];
}

export async function listIdeas(): Promise<IdeaRow[]> {
  return prisma.$queryRawUnsafe<IdeaRow[]>(
    `SELECT id, title, description, "createdAt"
     FROM ideas
     ORDER BY "createdAt" DESC`
  );
}

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

export async function countIdeas(): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*)::bigint AS count FROM ideas`
  );
  return Number(rows[0]?.count ?? 0);
}

export async function truncateIdeas(): Promise<void> {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ideas`);
}
