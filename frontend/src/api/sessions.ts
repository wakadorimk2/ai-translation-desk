import { apiFetch } from "./client";
import type { Session } from "../types";

export const fetchSessions = () => apiFetch<Session[]>("/sessions");

export const createSession = (data: { target_company?: string; context?: string }) =>
  apiFetch<Session>("/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchSession = (id: number) =>
  apiFetch<Session>(`/sessions/${id}`);
