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
    <Card className={clients.length > 0 ? 'border-[#ED8936] bg-[#ED8936]/10' : undefined}>
      <CardHeader>
        <CardTitle>{clients.length > 0 ? 'Recuperar carteira' : 'Carteira em dia'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {clients.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-[#1B4332]/20 bg-background p-4 text-sm font-medium text-muted-foreground">
            Nenhum cliente crítico sem contato nos últimos 30 dias.
          </p>
        ) : (
          clients.map((item) => (
            <div key={item.client.id} className="rounded-lg border-2 border-[#ED8936]/40 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/clients/${item.client.id}`}
                    className="line-clamp-1 text-sm font-black uppercase tracking-[0.02em] hover:text-primary"
                  >
                    {item.client.name}
                  </Link>
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {item.last_visit_at ? `Última visita em ${formatDate(item.last_visit_at)}` : 'Sem visitas registradas'}
                  </p>
                </div>
                <Link
                  to={`/visits/new?clientId=${item.client.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Recuperar
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
