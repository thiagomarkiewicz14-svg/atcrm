import { Link } from 'react-router-dom';

import { DashboardAgendaItem } from '@/components/dashboard/TodayAgendaCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AgendaEvent } from '@/types/agenda.types';

interface UpcomingVisitsCardProps {
  events: AgendaEvent[];
}

export function UpcomingVisitsCard({ events }: UpcomingVisitsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Próximas visitas</CardTitle>
          <Link to="/agenda" className="text-sm font-semibold text-primary hover:underline">
            Ver agenda
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-background/25 p-4 text-sm text-muted-foreground">
            Sem visitas nos próximos 7 dias.
          </p>
        ) : (
          events.slice(0, 6).map((event) => <DashboardAgendaItem key={event.id} event={event} />)
        )}
      </CardContent>
    </Card>
  );
}
