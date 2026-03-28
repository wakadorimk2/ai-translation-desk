import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["auth"],
    queryFn: () => apiFetch<{ authenticated: boolean }>("/auth/me"),
    retry: false,
  });

  const login = async (username: string, password: string) => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  return {
    isAuthenticated: !!data?.authenticated,
    isLoading: isLoading || isFetching,
    login,
    logout,
  };
}
