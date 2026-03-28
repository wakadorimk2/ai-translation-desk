import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLogs, createLog, updateLog } from "../api/questionLogs";

export function useQuestionLogs(sessionId: number | null) {
  return useQuery({
    queryKey: ["logs", sessionId],
    queryFn: () => fetchLogs(sessionId!),
    enabled: sessionId !== null,
  });
}

export function useCreateLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: number;
      data: Parameters<typeof createLog>[1];
    }) => createLog(sessionId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs"] }),
  });
}

export function useUpdateLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      logId,
      data,
    }: {
      logId: number;
      data: Parameters<typeof updateLog>[1];
    }) => updateLog(logId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs"] }),
  });
}
