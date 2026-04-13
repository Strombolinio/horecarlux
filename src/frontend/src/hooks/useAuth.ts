import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const { login, clear, isLoginSuccess, identity, loginStatus } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const principalId = identity?.getPrincipal()?.toString();

  return {
    isAuthenticated,
    isLoading,
    isLoginSuccess,
    identity,
    principalId,
    login: handleLogin,
    logout: handleLogout,
  };
}
