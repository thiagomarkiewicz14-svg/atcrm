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
    <Card
      className="bg-white border-[#E8D5D5]"
      style={isCritical ? { borderLeft: '4px solid #C53030' } : { borderLeft: '4px solid #1B4332' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={isCritical ? 'h-4 w-4 text-[#C53030]' : 'h-4 w-4 text-[#1B4332]'}
            />
            <CardTitle className="text-[#1B4332]">
              {isCritical ? 'Atenção imediata' : 'Atenção'}
            </CardTitle>
            {isCritical && (
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#FEF2F2] text-[#C53030] border border-[#FECACA]">
                {(alerts.unreadNotificationsCount + alerts.activeNotificationsCount +
                  alerts.overdueNextVisits.length)} alertas
              </span>
            )}
          </div>
          <Link
            to="/notifications"
            className="text-xs font-black uppercase tracking-[0.08em] text-[#1B4332] hover:underline"
          >
            Alertas
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Métricas ── */}
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

        {/* ── Estado vazio ── */}
        {!hasNotifications && !hasOverdueVisits ? (
          <p className="rounded-lg border-2 border-[#1B4332]/20 bg-[#F5F0E8] p-4 text-sm font-medium text-muted-foreground">
            Sem risco operacional pendente agora.
          </p>
        ) : null}

        {/* ── Visitas atrasadas ── */}
        {hasOverdueVisits ? (
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-[#C53030]">
              Visitas atrasadas
            </p>
            <div className="space-y-2">
              {alerts.overdueNextVisits.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-[#F0EDE8] bg-[#FAFAFA]"
                  style={{ borderLeft: '3px solid #C53030' }}
                >
                  <DashboardAgendaItem event={event} variant="alert" />
                </div>
              ))}
            </div>
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
    <div className={
      critical
        ? 'rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4'
        : 'rounded-lg border-2 border-[#1B4332]/20 bg-[#F5F0E8] p-4'
    }>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Icon className={critical ? 'h-4 w-4 text-[#C53030]' : 'h-4 w-4 text-[#1B4332]'} />
        <Badge variant={critical ? 'warning' : 'muted'}>{value}</Badge>
      </div>
      <p className={
        critical
          ? 'text-xs font-black uppercase tracking-[0.08em] text-[#C53030]'
          : 'text-xs font-black uppercase tracking-[0.08em] text-muted-foreground'
      }>
        {label}
      </p>
    </div>
  );
}
