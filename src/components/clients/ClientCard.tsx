import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Rows3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { buildClientIntroMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import type { Client, ClientStatus, CommercialPotential } from '@/types/client.types';

interface ClientCardProps {
  client: Client;
}

const statusLabels: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Ativo',
  inactive: 'Inativo',
  lost: 'Perdido',
};

const potentialLabels: Record<CommercialPotential, string> = {
  low: 'Baixo potencial',
  medium: 'Médio potencial',
  high: 'Alto potencial',
};

export function ClientCard({ client }: ClientCardProps) {
  const location = [client.city, client.state].filter(Boolean).join(' / ');
  const whatsappLink = client.whatsapp
    ? buildWhatsAppLink(client.whatsapp, buildClientIntroMessage(client))
    : null;

  return (
    <Card className="group transition-colors duration-200 hover:border-primary/35">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Link
              to={`/clients/${client.id}`}
              className="block truncate text-lg font-semibold leading-tight transition-colors group-hover:text-primary"
            >
              {client.name}
            </Link>
            {location ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{location}</span>
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Badge variant={client.status === 'active' ? 'default' : 'muted'}>{statusLabels[client.status]}</Badge>
            <Badge variant={client.commercial_potential === 'high' ? 'warning' : 'secondary'}>
              {potentialLabels[client.commercial_potential]}
            </Badge>
          </div>
        </div>

        {client.main_crops.length > 0 ? (
          <p className="flex items-start gap-2 rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
            <Rows3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-2">{client.main_crops.join(', ')}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/clients/${client.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Ver cliente
          </Link>
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
