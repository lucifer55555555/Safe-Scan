import { SCIENTIFIC_CHUNKS, SCIENTIFIC_SOURCES } from '../data/scientificCorpus';
import { EvidenceItem, ScientificChunk, ScientificSource } from '../types';

const sourceMap = new Map<string, ScientificSource>();
SCIENTIFIC_SOURCES.forEach((s) => sourceMap.set(s.id, s));

/**
 * Calculates keyword & semantic similarity score between query tokens and chunk metadata/text
 */
function scoreChunk(chunk: ScientificChunk, queryTokens: string[]): number {
  let score = 0;
  const chunkTextLower = chunk.text.toLowerCase();
  const topicLower = chunk.metadata.topic.toLowerCase();
  const ingredientLower = chunk.metadata.ingredient.toLowerCase();
  const keywordsLower = chunk.metadata.keywords.map((k) => k.toLowerCase());

  for (const token of queryTokens) {
    if (!token || token.length < 2) continue;

    // Exact ingredient metadata match
    if (ingredientLower.includes(token)) score += 10.0;
    // Keyword match
    if (keywordsLower.some((k) => k.includes(token) || token.includes(k))) score += 8.0;
    // Topic match
    if (topicLower.includes(token)) score += 5.0;
    // Text body match
    if (chunkTextLower.includes(token)) score += 3.0;
  }

  return score;
}

/**
 * Retrieves top-k authoritative FDA/EFSA evidence chunks for a set of conflicted or target ingredients
 * (Executes per-ingredient retrieval per Section 8 Phase 7)
 */
export function retrieveEvidence(
  ingredients: string[],
  topK: number = 3
): {
  chunks: ScientificChunk[];
  evidenceItems: EvidenceItem[];
  evidenceConfidence: 'high' | 'medium' | 'low';
} {
  if (!ingredients || ingredients.length === 0) {
    return { chunks: [], evidenceItems: [], evidenceConfidence: 'low' };
  }

  const matchedChunks: Map<string, { chunk: ScientificChunk; score: number }> = new Map();

  for (const ing of ingredients) {
    const rawTokens = ing
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    for (const chunk of SCIENTIFIC_CHUNKS) {
      const s = scoreChunk(chunk, rawTokens);
      if (s > 0) {
        const existing = matchedChunks.get(chunk.id);
        if (!existing || s > existing.score) {
          matchedChunks.set(chunk.id, { chunk, score: s });
        }
      }
    }
  }

  // Sort by score descending
  const sorted = Array.from(matchedChunks.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const chunks = sorted.map((item) => ({
    ...item.chunk,
    similarityScore: Math.min(0.99, Number((item.score / 25).toFixed(2)))
  }));

  const evidenceItems: EvidenceItem[] = chunks.map((c) => {
    const src = sourceMap.get(c.sourceId);
    return {
      source: src ? `${src.organization} — ${src.title}` : c.metadata.org,
      title: src?.title || c.metadata.topic,
      organization: (src?.organization || c.metadata.org) as string,
      url: src?.url || 'https://www.fda.gov',
      excerpt: c.text,
      publicationDate: src?.publicationDate
    };
  });

  const maxScore = sorted.length > 0 ? sorted[0].score : 0;
  const evidenceConfidence = maxScore >= 15 ? 'high' : maxScore >= 6 ? 'medium' : 'low';

  return {
    chunks,
    evidenceItems,
    evidenceConfidence
  };
}
