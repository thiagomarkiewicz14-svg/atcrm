import { Logo } from '@/components/brand/Logo';
import { ClientsWithoutRecentVisitCard } from '@/components/dashboard/ClientsWithoutRecentVisitCard';
import { DashboardAlertsCard } from '@/components/dashboard/DashboardAlertsCard';
import { DashboardKpiGrid } from '@/components/dashboard/DashboardKpiGrid';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { RecentClientsCard } from '@/components/dashboard/RecentClientsCard';
import { TodayAgendaCard } from '@/components/dashboard/TodayAgendaCard';
import { UpcomingVisitsCard } from '@/components/dashboard/UpcomingVisitsCard';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import {
  useClientsWithoutRecentVisit,
  useDashboardAlerts,
  useDashboardSummary,
  useRecentClients,
  useTodayAgenda,
  useUpcomingWeekAgenda,
} from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export function DashboardPage() {
  const profileQuery = useProfile();
  const summaryQuery = useDashboardSummary();
  const todayAgendaQuery = useTodayAgenda();
  const upcomingWeekAgendaQuery = useUpcomingWeekAgenda();
  const alertsQuery = useDashboardAlerts();
  const clientsWithoutRecentVisitQuery = useClientsWithoutRecentVisit();
  const recentClientsQuery = useRecentClients();

  const isLoading =
    summaryQuery.isLoading ||
    todayAgendaQuery.isLoading ||
    upcomingWeekAgendaQuery.isLoading ||
    alertsQuery.isLoading ||
    clientsWithoutRecentVisitQuery.isLoading ||
    recentClientsQuery.isLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  const error =
    summaryQuery.error ??
    todayAgendaQuery.error ??
    upcomingWeekAgendaQuery.error ??
    alertsQuery.error ??
    clientsWithoutRecentVisitQuery.error ??
    recentClientsQuery.error;

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          void summaryQuery.refetch();
          void todayAgendaQuery.refetch();
          void upcomingWeekAgendaQuery.refetch();
          void alertsQuery.refetch();
          void clientsWithoutRecentVisitQuery.refetch();
          void recentClientsQuery.refetch();
        }}
      />
    );
  }

  const firstName = profileQuery.data?.full_name?.split(' ')[0];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:linear-gradient(135deg,rgba(45,106,79,.28)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative">
          <Logo variant="compact" className="mb-5" />
          <p className="text-sm font-semibold capitalize text-primary">{dayFormatter.format(new Date())}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            {firstName ? `Hoje no campo, ${firstName}` : 'Hoje no campo'}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Central operacional do AT CRM: visitas, alertas e carteira em uma visão rápida para o dia de campo.
          </p>
        </div>
      </section>

      <DashboardKpiGrid
        summary={
          summaryQuery.data ?? {
            totalClients: 0,
            activeClients: 0,
            prospects: 0,
            highPotentialClients: 0,
          }
        }
      />

      <TodayAgendaCard events={todayAgendaQuery.data ?? []} />

      <DashboardAlertsCard
        alerts={
          alertsQuery.data ?? {
            unreadNotificationsCount: 0,
            activeNotificationsCount: 0,
            overdueNextVisits: [],
          }
        }
      />

      <UpcomingVisitsCard events={upcomingWeekAgendaQuery.data ?? []} />

      <ClientsWithoutRecentVisitCard clients={clientsWithoutRecentVisitQuery.data ?? []} />

      <RecentClientsCard clients={recentClientsQuery.data ?? []} />

      <QuickActionsCard />
    </div>
  );
}
