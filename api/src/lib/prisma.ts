import { PrismaClient } from "@prisma/client";
import { withPGVector } from "prisma-extension-pgvector";

export const prisma = new PrismaClient().$extends(
  withPGVector({
    modelName: "idea",             // model do schema.prisma que tem o campo vetor
    vectorFieldName: "embedding",  // nome da coluna vector(N) dentro desse model
    idFieldName: "id",             // PK do model (usado em getVectorsById/updateVector)
  })
);
