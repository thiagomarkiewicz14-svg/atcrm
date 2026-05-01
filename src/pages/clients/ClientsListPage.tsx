import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { ClientCard } from '@/components/clients/ClientCard';
import { ClientsFilters } from '@/components/clients/ClientsFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { buttonVariants } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { useDebounce } from '@/hooks/useDebounce';
import type { ClientStatus, CommercialPotential } from '@/types/client.types';

export function ClientsListPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');
  const [commercialPotential, setCommercialPotential] = useState<CommercialPotential | 'all'>('all');
  const debouncedSearch = useDebounce(search);
  const clientsQuery = useClients({
    search: debouncedSearch,
    status,
    commercialPotential,
  });

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Clientes</h1>
          <p className="mt-2 text-sm text-muted-foreground">Carteira comercial portátil.</p>
        </div>
        <Link to="/clients/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" />
          Novo
        </Link>
      </section>

      <ClientsFilters
        search={search}
        status={status}
        commercialPotential={commercialPotential}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCommercialPotentialChange={setCommercialPotential}
      />

      {clientsQuery.isLoading ? <LoadingState /> : null}

      {clientsQuery.isError ? (
        <ErrorState error={clientsQuery.error} onRetry={() => void clientsQuery.refetch()} />
      ) : null}

      {clientsQuery.isSuccess && clientsQuery.data.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Ajuste os filtros ou cadastre um novo cliente."
          action={
            <Link to="/clients/new" className={buttonVariants({ size: 'sm' })}>
              <Plus className="h-4 w-4" />
              Novo cliente
            </Link>
          }
        />
      ) : null}

      {clientsQuery.isSuccess && clientsQuery.data.length > 0 ? (
        <div className="space-y-3">
          {clientsQuery.data.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
