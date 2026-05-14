import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

let extractor: FeatureExtractionPipeline | null = null;

const MODEL = "Xenova/all-MiniLM-L6-v2";

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractor) {
    console.log(`[embedding] loading model ${MODEL}...`);
    extractor = await pipeline("feature-extraction", MODEL);
    console.log("[embedding] model ready");
  }
  return extractor;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getExtractor();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export async function warmup(): Promise<void> {
  await getExtractor();
}
