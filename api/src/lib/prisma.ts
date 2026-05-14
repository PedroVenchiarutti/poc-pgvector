import { PrismaClient } from "@prisma/client";
import { withPGVector } from "prisma-extension-pgvector";

export const prisma = new PrismaClient().$extends(
  withPGVector({
    modelName: "idea",
    vectorFieldName: "embedding",
    idFieldName: "id",
  })
);
