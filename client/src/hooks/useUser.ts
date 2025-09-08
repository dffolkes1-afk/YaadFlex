import { useQuery } from '@tanstack/react-query';

export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error
  };
}