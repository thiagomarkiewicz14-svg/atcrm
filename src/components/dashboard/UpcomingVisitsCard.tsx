import { Link } from 'react-router-dom';

import { DashboardAgendaItem } from '@/components/dashboard/TodayAgendaCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AgendaEvent } from '@/types/agenda.types';

interface UpcomingVisitsCardProps {
  events: AgendaEvent[];
}

export function UpcomingVisitsCard({ events }: UpcomingVisitsCardProps) {
  return (
    <Card className="border-[#1B4332] bg-[#1B4332] text-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Próximas visitas</CardTitle>
          <Link to="/agenda" className="text-xs font-black uppercase tracking-[0.08em] text-[#D4A373] hover:underline">
            Ver rota
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/20 bg-white/10 p-4 text-sm font-medium text-white/70">
            Sem visitas nos próximos 7 dias. Hora de recuperar carteira.
          </p>
        ) : (
          events.slice(0, 6).map((event) => <DashboardAgendaItem key={event.id} event={event} />)
        )}
      </CardContent>
    </Card>
  );
}
