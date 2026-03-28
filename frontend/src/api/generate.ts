import { apiFetch } from "./client";
import type { SearchResult } from "../types";

export const searchFragments = (question: string, topK = 5) =>
  apiFetch<{ results: SearchResult[] }>("/generate/search", {
    method: "POST",
    body: JSON.stringify({ question, top_k: topK }),
  });

export const generateDraft = (
  question: string,
  fragmentIds: number[],
  context?: string
) =>
  apiFetch<{ drafted_answer: string }>("/generate/draft", {
    method: "POST",
    body: JSON.stringify({ question, fragment_ids: fragmentIds, context }),
  });
