import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell } from 'lucide-react';

import { DashboardAgendaItem } from '@/components/dashboard/TodayAgendaCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardAlerts } from '@/types/dashboard.types';

interface DashboardAlertsCardProps {
  alerts: DashboardAlerts;
}

export function DashboardAlertsCard({ alerts }: DashboardAlertsCardProps) {
  const hasOverdueVisits = alerts.overdueNextVisits.length > 0;
  const hasNotifications = alerts.unreadNotificationsCount > 0 || alerts.activeNotificationsCount > 0;
  const isCritical = hasOverdueVisits || hasNotifications;

  return (
    <Card className={isCritical ? 'border-[#C53030] bg-[#C53030] text-white' : 'border-[#1B4332] bg-[#F3F5F0]'}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{isCritical ? 'Atenção imediata' : 'Atenção'}</CardTitle>
          <Link
            to="/notifications"
            className={isCritical ? 'text-xs font-black uppercase tracking-[0.08em] text-white hover:underline' : 'text-xs font-black uppercase tracking-[0.08em] text-primary hover:underline'}
          >
            Alertas
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AlertMetric
            icon={Bell}
            label="Não lidas"
            value={alerts.unreadNotificationsCount}
            critical={isCritical && alerts.unreadNotificationsCount > 0}
          />
          <AlertMetric
            icon={AlertTriangle}
            label="Ativas"
            value={alerts.activeNotificationsCount}
            critical={isCritical && alerts.activeNotificationsCount > 0}
          />
        </div>

        {!hasNotifications && !hasOverdueVisits ? (
          <p className="rounded-lg border-2 border-[#1B4332]/20 bg-background p-4 text-sm font-medium text-muted-foreground">
            Sem risco operacional pendente agora.
          </p>
        ) : null}

        {hasOverdueVisits ? (
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-white/80">Visitas atrasadas</p>
            {alerts.overdueNextVisits.map((event) => (
              <DashboardAgendaItem key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function AlertMetric({
  icon: Icon,
  label,
  value,
  critical,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  critical: boolean;
}) {
  return (
    <div className={critical ? 'rounded-lg border-2 border-white/30 bg-white/10 p-4' : 'rounded-lg border-2 border-[#1B4332]/20 bg-background p-4'}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Icon className={critical ? 'h-4 w-4 text-white' : 'h-4 w-4 text-primary'} />
        <Badge variant={critical ? 'info' : 'muted'}>{value}</Badge>
      </div>
      <p className={critical ? 'text-xs font-black uppercase tracking-[0.08em] text-white/75' : 'text-xs font-black uppercase tracking-[0.08em] text-muted-foreground'}>{label}</p>
    </div>
  );
}
