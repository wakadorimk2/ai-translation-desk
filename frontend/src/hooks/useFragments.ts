import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFragments,
  createFragment,
  updateFragment,
  deleteFragment,
} from "../api/fragments";
import type { FragmentCreate } from "../types";

export function useFragments(tag?: string) {
  return useQuery({
    queryKey: ["fragments", tag],
    queryFn: () => fetchFragments(tag),
  });
}

export function useCreateFragment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FragmentCreate) => createFragment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fragments"] }),
  });
}

export function useUpdateFragment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FragmentCreate }) =>
      updateFragment(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fragments"] }),
  });
}

export function useDeleteFragment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFragment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fragments"] }),
  });
}
