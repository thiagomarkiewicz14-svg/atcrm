import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/formatters';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';

interface ClientsWithoutRecentVisitCardProps {
  clients: ClientWithoutRecentVisit[];
}

export function ClientsWithoutRecentVisitCard({ clients }: ClientsWithoutRecentVisitCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes sem contato recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {clients.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-background/25 p-4 text-sm text-muted-foreground">
            Carteira em dia nos últimos 30 dias.
          </p>
        ) : (
          clients.map((item) => (
            <div key={item.client.id} className="rounded-2xl border border-border bg-background/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/clients/${item.client.id}`}
                    className="line-clamp-1 text-sm font-bold hover:text-primary"
                  >
                    {item.client.name}
                  </Link>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {item.last_visit_at ? `Última visita em ${formatDate(item.last_visit_at)}` : 'Sem visitas registradas'}
                  </p>
                </div>
                <Link
                  to={`/visits/new?clientId=${item.client.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Visitar
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
