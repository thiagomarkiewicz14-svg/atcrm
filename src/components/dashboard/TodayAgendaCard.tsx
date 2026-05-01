import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarClock, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/formatters';
import { getVisitTypeLabel } from '@/lib/visit-options';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';

interface TodayAgendaCardProps {
  events: AgendaEvent[];
}

export function TodayAgendaCard({ events }: TodayAgendaCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Hoje no campo</CardTitle>
          <Link to="/agenda" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Agenda
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
            Nenhuma visita marcada para hoje.
          </p>
        ) : (
          events.map((event) => <DashboardAgendaItem key={event.id} event={event} />)
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardAgendaItem({ event }: { event: AgendaEvent }) {
  const isNextVisit = event.type === 'next_visit';

  return (
    <div
      className={cn(
        'rounded-2xl border bg-background p-4 transition-colors duration-200 hover:border-primary/40 hover:bg-white',
        isNextVisit ? 'border-[#ED8936]/30' : 'border-primary/20',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDateTime(event.starts_at)}
          </p>
          <p className="line-clamp-1 text-base font-semibold">{event.client_name}</p>
          {event.farm_name ? (
            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {event.farm_name}
            </p>
          ) : null}
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.purpose}</p>
        </div>
        <Badge variant={isNextVisit ? 'warning' : 'default'}>
          {isNextVisit ? 'Próxima visita' : 'Visita'}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">{getVisitTypeLabel(event.visit_type)}</span>
        <Link to={`/visits/${event.source_visit_id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Abrir
        </Link>
      </div>
    </div>
  );
}
