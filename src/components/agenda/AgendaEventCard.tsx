import { Link } from 'react-router-dom';
import { Clock, MapPinned } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getVisitStatusLabel, getVisitTypeLabel } from '@/lib/visit-options';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';

interface AgendaEventCardProps {
  event: AgendaEvent;
}

const colorClasses: Record<AgendaEvent['color_variant'], string> = {
  green: 'border-l-primary',
  blue: 'border-l-[#D4A373]',
  amber: 'border-l-[#ED8936]',
  gray: 'border-l-muted-foreground',
};

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export function AgendaEventCard({ event }: AgendaEventCardProps) {
  const isNextVisit = event.type === 'next_visit';

  return (
    <Card className={cn('border-l-4 transition-colors duration-200 hover:border-primary/35', colorClasses[event.color_variant])}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeFormatter.format(new Date(event.starts_at))}
            </p>
            <h3 className="line-clamp-2 text-base font-semibold">
              {event.title}: {event.purpose}
            </h3>
          </div>
          <Badge variant={isNextVisit ? 'warning' : 'default'}>{isNextVisit ? 'Próxima' : 'Visita'}</Badge>
        </div>

        <div className="space-y-1 rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">{event.client_name}</p>
          {event.farm_name ? (
            <p className="flex items-center gap-2">
              <MapPinned className="h-4 w-4 text-primary" />
              {event.farm_name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{getVisitTypeLabel(event.visit_type)}</Badge>
          <Badge variant="secondary">{getVisitStatusLabel(event.status)}</Badge>
          <Link
            to={`/visits/${event.source_visit_id}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'ml-auto')}
          >
            Abrir detalhe
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
