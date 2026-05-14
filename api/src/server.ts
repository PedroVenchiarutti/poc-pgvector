import Fastify from "fastify";
import cors from "@fastify/cors";
import { ideaRoutes } from "./routes/idea.routes.js";
import { warmup } from "./services/embedding.service.js";

const PORT = Number(process.env.PORT ?? 3333);

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(ideaRoutes);

  app.get("/health", async () => ({ ok: true }));

  await warmup();

  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`API ready on port ${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
