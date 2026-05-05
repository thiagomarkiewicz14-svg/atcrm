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
  'h-11 w-full rounded-lg border-2 border-input bg-white px-3 text-sm text-foreground shadow-none outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-ring/20';

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
      <section className="relative overflow-hidden rounded-xl border-2 border-[#1B4332] bg-[#1B4332] p-5 text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4A373]">Operação técnica</p>
            <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">Visitas</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-white/70">Registro, próxima ação e evidência de campo.</p>
          </div>
          <Link to="/visits/new" className={`${buttonVariants({ size: 'sm' })} bg-[#D4A373] text-[#1B4332] hover:bg-white`}>
            <Plus className="h-4 w-4" />
            Ir agora
          </Link>
        </div>
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
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-[#1B4332]">Visitas recentes</h2>

        {visits.length === 0 ? (
          <EmptyState
            title="Nenhuma visita encontrada"
            description="Registre a primeira ação para manter o histórico de campo."
            action={
              <Link to="/visits/new" className={buttonVariants({ size: 'sm' })}>
                <Plus className="h-4 w-4" />
                Ir agora
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
    <Card className="border-[#1B4332]/30 bg-[#F3F5F0]">
      <CardContent className="p-4">
        <p className="text-3xl font-black leading-none text-[#1B4332]">{value}</p>
        <p className="mt-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
