import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, MapPin } from 'lucide-react';

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
    <Card className="border-[#1B4332] bg-[#1B4332] text-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Hoje no campo</CardTitle>
          <Link to="/agenda" className="text-xs font-black uppercase tracking-[0.08em] text-[#D4A373] hover:underline">
            Rota
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-lg border border-white/20 bg-white/10 p-4 text-sm font-medium text-white/70">
            Nenhuma visita marcada. Use a janela livre para recuperar carteira sem contato.
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
        'rounded-lg border-2 p-4 transition-colors duration-150',
        isNextVisit ? 'border-[#ED8936] bg-[#ED8936]/10' : 'border-white/20 bg-white/10',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-white/60">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDateTime(event.starts_at)}
          </p>
          <p className="line-clamp-1 text-base font-black uppercase">{event.client_name}</p>
          {event.farm_name ? (
            <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-white/70">
              <MapPin className="h-3.5 w-3.5" />
              {event.farm_name}
            </p>
          ) : null}
          <p className="line-clamp-2 text-sm font-medium text-white/75">{event.purpose}</p>
        </div>
        <Badge variant={isNextVisit ? 'warning' : 'info'}>{isNextVisit ? 'Recuperar' : 'Ir agora'}</Badge>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.08em] text-white/50">
          {getVisitTypeLabel(event.visit_type)}
        </span>
        <Link to={`/visits/${event.source_visit_id}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          Abrir <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
