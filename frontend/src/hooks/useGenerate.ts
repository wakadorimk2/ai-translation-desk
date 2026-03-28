import { useMutation } from "@tanstack/react-query";
import { searchFragments, generateDraft } from "../api/generate";

export function useSearchFragments() {
  return useMutation({
    mutationFn: ({ question, topK }: { question: string; topK?: number }) =>
      searchFragments(question, topK),
  });
}

export function useGenerateDraft() {
  return useMutation({
    mutationFn: ({
      question,
      fragmentIds,
      context,
    }: {
      question: string;
      fragmentIds: number[];
      context?: string;
    }) => generateDraft(question, fragmentIds, context),
  });
}
