import { apiFetch } from "./client";
import type { Fragment, FragmentCreate } from "../types";

export const fetchFragments = (tag?: string) =>
  apiFetch<Fragment[]>(`/fragments${tag ? `?tag=${tag}` : ""}`);

export const fetchFragment = (id: number) =>
  apiFetch<Fragment>(`/fragments/${id}`);

export const createFragment = (data: FragmentCreate) =>
  apiFetch<Fragment>("/fragments", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateFragment = (id: number, data: FragmentCreate) =>
  apiFetch<Fragment>(`/fragments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteFragment = (id: number) =>
  apiFetch<void>(`/fragments/${id}`, { method: "DELETE" });
