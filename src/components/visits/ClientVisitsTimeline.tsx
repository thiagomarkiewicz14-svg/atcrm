import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { buttonVariants } from '@/components/ui/button';
import { VisitCard } from '@/components/visits/VisitCard';
import { useVisitsByClient } from '@/hooks/useVisits';

interface ClientVisitsTimelineProps {
  clientId: string;
}

export function ClientVisitsTimeline({ clientId }: ClientVisitsTimelineProps) {
  const visitsQuery = useVisitsByClient(clientId);

  if (visitsQuery.isLoading) {
    return <LoadingState />;
  }

  if (visitsQuery.isError) {
    return <ErrorState error={visitsQuery.error} onRetry={() => void visitsQuery.refetch()} />;
  }

  const visits = visitsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Visitas</h2>
        <Link to={`/visits/new?clientId=${clientId}`} className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" />
          Nova visita
        </Link>
      </div>

      {visits.length === 0 ? (
        <EmptyState
          title="Nenhuma visita registrada"
          description="Registre a primeira visita técnica ou comercial deste cliente."
          action={
            <Link to={`/visits/new?clientId=${clientId}`} className={buttonVariants({ size: 'sm' })}>
              <Plus className="h-4 w-4" />
              Nova visita
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} showClient={false} />
          ))}
        </div>
      )}
    </div>
  );
}
