import { apiFetch } from "./client";
import type { QuestionLog } from "../types";

export const fetchLogs = (sessionId: number) =>
  apiFetch<QuestionLog[]>(`/sessions/${sessionId}/logs`);

export const createLog = (
  sessionId: number,
  data: {
    question_text: string;
    question_type?: string;
    suggested_fragment_ids?: number[];
    selected_fragment_ids?: number[];
    drafted_answer?: string;
  }
) =>
  apiFetch<QuestionLog>(`/sessions/${sessionId}/logs`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateLog = (
  logId: number,
  data: { actual_answer_memo?: string; stuck_points?: string }
) =>
  apiFetch<QuestionLog>(`/logs/${logId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
