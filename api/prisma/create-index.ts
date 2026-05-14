import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("[index] criando HNSW em ideas.embedding...");
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_ideas_embedding
     ON ideas USING hnsw (embedding vector_cosine_ops)`
  );
  console.log("[index] HNSW pronto");
}

main()
  .catch((err) => {
    console.error("[index] erro:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
