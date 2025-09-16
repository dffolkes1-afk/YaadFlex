import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isBlackRockExecutive?: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['/api/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Use user data directly from server without client-side mutations
  // Server handles all CEO detection and name display logic
  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !error,
  };
}
