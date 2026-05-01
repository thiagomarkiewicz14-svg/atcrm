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
          <CardTitle>Últimos clientes</CardTitle>
          <Link to="/clients" className="text-sm font-semibold text-primary hover:underline">
            Ver todos
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {clients.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-background/25 p-4 text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="block rounded-2xl border border-border bg-background p-4 transition-colors duration-200 hover:border-primary/35 hover:bg-white"
            >
              <p className="line-clamp-1 text-sm font-bold">{client.name}</p>
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
