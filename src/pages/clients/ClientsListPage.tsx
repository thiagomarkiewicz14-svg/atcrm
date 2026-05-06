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
      <section className="relative overflow-hidden rounded-xl border-2 border-[#1E3A2F] bg-[#1E3A2F] p-5 text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">Carteira de campo</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">Clientes</h1>
          <p className="mt-2 text-sm font-medium text-white/70">Priorize alvos, contatos e oportunidades por praça.</p>
        </div>
        <Link to="/clients/new" className={`${buttonVariants({ size: 'sm' })} bg-[#C8A951] text-[#1E3A2F] hover:bg-white`}>
          <Plus className="h-4 w-4" />
          Cadastrar alvo
        </Link>
        </div>
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
          title="Nenhum alvo na carteira"
          description="Ajuste os filtros ou cadastre um cliente para abrir rota."
          action={
            <Link to="/clients/new" className={buttonVariants({ size: 'sm' })}>
              <Plus className="h-4 w-4" />
              Cadastrar alvo
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
