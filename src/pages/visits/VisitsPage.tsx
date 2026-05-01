import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VisitCard } from '@/components/visits/VisitCard';
import { useClients } from '@/hooks/useClients';
import { useUpcomingVisits, useVisitStats, useVisits } from '@/hooks/useVisits';
import { cn } from '@/lib/utils';
import { visitStatuses } from '@/lib/visit-options';
import type { VisitStatus } from '@/types/visit.types';

const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15';

export function VisitsPage() {
  const [status, setStatus] = useState<VisitStatus | 'all'>('all');
  const [clientId, setClientId] = useState<string | 'all'>('all');
  const visitsQuery = useVisits({ status, clientId });
  const upcomingVisitsQuery = useUpcomingVisits();
  const statsQuery = useVisitStats();
  const clientsQuery = useClients();

  const isLoading =
    visitsQuery.isLoading || upcomingVisitsQuery.isLoading || statsQuery.isLoading || clientsQuery.isLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  const error = visitsQuery.error ?? upcomingVisitsQuery.error ?? statsQuery.error ?? clientsQuery.error;

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          void visitsQuery.refetch();
          void upcomingVisitsQuery.refetch();
          void statsQuery.refetch();
          void clientsQuery.refetch();
        }}
      />
    );
  }

  const visits = visitsQuery.data ?? [];
  const upcomingVisits = upcomingVisitsQuery.data ?? [];
  const stats = statsQuery.data;
  const clients = clientsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Visitas</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Registros técnicos e comerciais de campo.</p>
        </div>
        <Link to="/visits/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" />
          Nova
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={stats?.total ?? 0} />
        <StatCard label="Agendadas" value={stats?.scheduled ?? 0} />
        <StatCard label="Realizadas" value={stats?.completed ?? 0} />
        <StatCard label="Próximas" value={stats?.upcoming ?? 0} />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          className={cn(selectClassName)}
          value={status}
          onChange={(event) => setStatus(event.target.value as VisitStatus | 'all')}
        >
          <option value="all">Todos os status</option>
          {visitStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className={cn(selectClassName)}
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        >
          <option value="all">Todos os clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </section>

      {upcomingVisits.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Próximas visitas</h2>
          </div>
          <div className="space-y-3">
            {upcomingVisits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Visitas recentes</h2>

        {visits.length === 0 ? (
          <EmptyState
            title="Nenhuma visita encontrada"
            description="Registre a primeira visita para manter o histórico de campo."
            action={
              <Link to="/visits/new" className={buttonVariants({ size: 'sm' })}>
                <Plus className="h-4 w-4" />
                Nova visita
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-3xl font-semibold leading-none">{value}</p>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
