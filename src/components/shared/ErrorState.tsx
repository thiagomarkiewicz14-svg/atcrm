import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  actionLabel?: string;
  onRetry?: () => void;
  className?: string;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível carregar as informações.';
}

export function ErrorState({
  title = 'Algo saiu do esperado',
  error,
  actionLabel = 'Tentar novamente',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-destructive/30 bg-destructive/10 p-6 text-center',
        className,
      )}
    >
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <div className="space-y-1">
        <h2 className="text-base font-black uppercase tracking-[0.04em]">{title}</h2>
        <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
