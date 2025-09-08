import { LanguageSettings } from '@/components/LanguageSettings';
import { useUser } from '@/hooks/useUser';

export function LanguageSettingsPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="container mx-auto">
        <LanguageSettings userId={user?.id} />
      </div>
    </div>
  );
}