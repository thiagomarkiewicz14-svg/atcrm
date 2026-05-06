import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/formatters';
import type { Client } from '@/types/client.types';

interface RecentClientsCardProps {
  clients: Client[];
}

export function RecentClientsCard({ clients }: RecentClientsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Novos alvos</CardTitle>
          <Link to="/clients" className="text-xs font-black uppercase tracking-[0.08em] text-primary hover:underline">
            Carteira
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {clients.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-[#1E3A2F]/20 bg-background p-4 text-sm font-medium text-muted-foreground">
            Nenhum alvo cadastrado ainda.
          </p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="block rounded-lg border-2 border-[#1E3A2F]/20 bg-background p-4 transition-colors duration-150 hover:border-primary/30 hover:bg-white"
            >
              <p className="line-clamp-1 text-sm font-black uppercase tracking-[0.02em]">{client.name}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {[client.city, client.state].filter(Boolean).join(' / ') || 'Localização não informada'} ·{' '}
                {formatDate(client.created_at)}
              </p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
