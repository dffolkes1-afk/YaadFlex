import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  // FULL AUTHENTICATION BYPASS FOR OWNER ACCESS
  const mockUser = {
    id: "owner-bypass",
    email: "owner@yaadflex.com",
    firstName: "Owner",
    lastName: "YaadFlex"
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true, // ALWAYS AUTHENTICATED
  };
}
