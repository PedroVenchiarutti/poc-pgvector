# POC pgvector — Busca Semântica de Ideias

POC pra entender embeddings + pgvector. API Fastify + Prisma com Transformers.js (modelo local `all-MiniLM-L6-v2`, 384 dims), front Vite + React + Tailwind, Postgres com extension pgvector via Docker.

## Arquitetura

```
poc-pgvector/
├── docker-compose.yml      # postgres (pgvector) + api
├── api/                    # Fastify + Prisma + Transformers.js (MVC)
│   ├── prisma/
│   │   ├── schema.prisma   # Idea model com vector(384)
│   │   ├── init.sql        # CREATE EXTENSION vector
│   │   └── seed.ts         # 22 ideias reais
│   └── src/
│       ├── models/         # Acesso a dados (raw SQL pgvector)
│       ├── views/          # DTOs / formatação
│       ├── controllers/    # Regra de negócio
│       ├── routes/         # Fastify routes
│       ├── services/       # Embedding (Transformers.js)
│       └── lib/            # Prisma client
└── web/                    # Vite + React + Tailwind
    └── src/
        ├── components/     # SearchInput, IdeaCard, IdeaList
        ├── hooks/          # useSearch, useIdeas
        └── lib/            # Cliente API
```

## Como rodar

### 1. Subir API + Postgres via Docker

```bash
docker compose up -d --build
```

Espera logs até API mostrar `API ready on port 3333`. Primeira execução baixa modelo Transformers (~25MB) — pode demorar.

### 2. Rodar seed

Dentro do container:

```bash
docker compose exec api npm run seed
```

Ou local (se tiver Node 20+ e Postgres exposto na porta 5432):

```bash
cd api
npm install
npm run seed
```

### 3. Subir front

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:5173

## Endpoints

- `GET /health` → `{ ok: true }`
- `GET /ideas` → lista todas
- `POST /search` body `{ query: string, limit?: number }` → top N + `similarityPercent`

## Como funciona a similaridade

1. Texto da busca passa pelo modelo `all-MiniLM-L6-v2` → vetor 384 dims (normalizado)
2. SQL: `SELECT *, 1 - (embedding <=> query::vector) AS similarity FROM ideas ORDER BY embedding <=> query LIMIT N`
3. Operador `<=>` = distância cosseno (0 = idêntico, 2 = oposto)
4. Front mostra `similarityPercent = similarity * 100`

## Stack

- **Backend:** Node 20, Fastify, Prisma, Transformers.js
- **DB:** Postgres 16 + pgvector extension
- **Front:** React 18, Vite 5, Tailwind 3
