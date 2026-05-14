import type { FastifyInstance } from "fastify";
import {
  createNewIdea,
  getAllIdeas,
  getSimilarIdeas,
  searchIdeas,
} from "../controllers/idea.controller.js";

export async function ideaRoutes(app: FastifyInstance) {
  app.get("/ideas", async () => {
    const ideas = await getAllIdeas();
    return { ideas };
  });

  app.post<{ Body: { title: string; description: string } }>("/ideas", async (req, reply) => {
    const { title, description } = req.body ?? { title: "", description: "" };
    if (typeof title !== "string" || title.trim().length === 0) {
      return reply.code(400).send({ error: "title is required" });
    }
    if (typeof description !== "string" || description.trim().length === 0) {
      return reply.code(400).send({ error: "description is required" });
    }
    const idea = await createNewIdea(title.trim(), description.trim());
    return reply.code(201).send({ idea });
  });

  app.get<{ Params: { id: string }; Querystring: { limit?: string } }>(
    "/ideas/:id/similar",
    async (req, reply) => {
      const { id } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      if (!id) {
        return reply.code(400).send({ error: "id is required" });
      }
      const results = await getSimilarIdeas(id, limit);
      return { ideaId: id, results };
    }
  );

  app.post<{ Body: { query: string; limit?: number } }>("/search", async (req, reply) => {
    const { query, limit } = req.body ?? { query: "" };
    if (typeof query !== "string") {
      return reply.code(400).send({ error: "query must be a string" });
    }
    const results = await searchIdeas(query, limit ?? 10);
    return { query, results };
  });
}
