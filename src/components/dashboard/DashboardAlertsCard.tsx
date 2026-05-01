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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Atenção</CardTitle>
          <Link to="/notifications" className="text-sm font-semibold text-primary hover:underline">
            Notificações
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AlertMetric
            icon={Bell}
            label="Não lidas"
            value={alerts.unreadNotificationsCount}
            variant={alerts.unreadNotificationsCount > 0 ? 'warning' : 'muted'}
          />
          <AlertMetric
            icon={AlertTriangle}
            label="Ativas"
            value={alerts.activeNotificationsCount}
            variant={alerts.activeNotificationsCount > 0 ? 'warning' : 'muted'}
          />
        </div>

        {!hasNotifications && !hasOverdueVisits ? (
          <p className="rounded-2xl border border-dashed border-border bg-background/25 p-4 text-sm text-muted-foreground">
            Nada crítico pendente agora.
          </p>
        ) : null}

        {hasOverdueVisits ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-destructive">Próximas visitas atrasadas</p>
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
  variant,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  variant: 'warning' | 'muted';
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Badge variant={variant === 'warning' ? 'warning' : 'muted'}>{value}</Badge>
      </div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
