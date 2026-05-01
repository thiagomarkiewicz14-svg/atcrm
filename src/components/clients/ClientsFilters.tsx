import type { ChangeEvent } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ClientStatus, CommercialPotential } from '@/types/client.types';

interface ClientsFiltersProps {
  search: string;
  status: ClientStatus | 'all';
  commercialPotential: CommercialPotential | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ClientStatus | 'all') => void;
  onCommercialPotentialChange: (value: CommercialPotential | 'all') => void;
}

const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15';

export function ClientsFilters({
  search,
  status,
  commercialPotential,
  onSearchChange,
  onStatusChange,
  onCommercialPotentialChange,
}: ClientsFiltersProps) {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value as ClientStatus | 'all');
  };

  const handlePotentialChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onCommercialPotentialChange(event.target.value as CommercialPotential | 'all');
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, documento, cidade ou fazenda"
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select className={cn(selectClassName)} value={status} onChange={handleStatusChange}>
          <option value="all">Todos os status</option>
          <option value="prospect">Prospects</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="lost">Perdidos</option>
        </select>

        <select className={cn(selectClassName)} value={commercialPotential} onChange={handlePotentialChange}>
          <option value="all">Todos os potenciais</option>
          <option value="low">Baixo potencial</option>
          <option value="medium">Médio potencial</option>
          <option value="high">Alto potencial</option>
        </select>
      </div>
    </div>
  );
}
