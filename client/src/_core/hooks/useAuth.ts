import { useCallback } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Mock user for local development
const MOCK_USER = {
  id: "local-user",
  name: "Dr. Victoria Henríquez",
  email: "victoria@pulmolab.cl",
  openId: "local",
};

export function useAuth(_options?: UseAuthOptions) {
  const logout = useCallback(async () => {
    console.log("Logout (mock)");
  }, []);

  return {
    user: MOCK_USER,
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => {},
    logout,
  };
}
