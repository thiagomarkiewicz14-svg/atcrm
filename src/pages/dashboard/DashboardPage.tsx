import { Logo } from '@/components/brand/Logo';
import { ClientsWithoutRecentVisitCard } from '@/components/dashboard/ClientsWithoutRecentVisitCard';
import { DailySummaryCard } from '@/components/dashboard/DailySummaryCard';
import { DashboardAlertsCard } from '@/components/dashboard/DashboardAlertsCard';
import { DashboardKpiGrid } from '@/components/dashboard/DashboardKpiGrid';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { RecentClientsCard } from '@/components/dashboard/RecentClientsCard';
import { SmartRouteCard } from '@/components/dashboard/SmartRouteCard';
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
import { useClients } from '@/hooks/useClients';
import { useProfile } from '@/hooks/useProfile';
import { useVisits } from '@/hooks/useVisits';

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
  const clientsQuery = useClients();
  const visitsQuery = useVisits();

  const isLoading =
    summaryQuery.isLoading ||
    todayAgendaQuery.isLoading ||
    upcomingWeekAgendaQuery.isLoading ||
    alertsQuery.isLoading ||
    clientsWithoutRecentVisitQuery.isLoading ||
    recentClientsQuery.isLoading ||
    clientsQuery.isLoading ||
    visitsQuery.isLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  const error =
    summaryQuery.error ??
    todayAgendaQuery.error ??
    upcomingWeekAgendaQuery.error ??
    alertsQuery.error ??
    clientsWithoutRecentVisitQuery.error ??
    recentClientsQuery.error ??
    clientsQuery.error ??
    visitsQuery.error;

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
          void clientsQuery.refetch();
          void visitsQuery.refetch();
        }}
      />
    );
  }

  const firstName = profileQuery.data?.full_name?.split(' ')[0];
  const clients = clientsQuery.data ?? [];
  const visits = visitsQuery.data ?? [];
  const clientsWithoutRecentVisit = clientsWithoutRecentVisitQuery.data ?? [];
  const recentClients = recentClientsQuery.data ?? [];
  const alerts = alertsQuery.data ?? {
    unreadNotificationsCount: 0,
    activeNotificationsCount: 0,
    overdueNextVisits: [],
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#1E3A2F] bg-[#1E3A2F] p-5 text-white shadow-[0_18px_48px_rgba(30,58,47,0.14)] sm:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-20 [background-image:linear-gradient(135deg,rgba(248,249,247,.45)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#C8A951]/20" />
        <div className="relative max-w-3xl">
          <Logo variant="compact" className="mb-5" />
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">{dayFormatter.format(new Date())}</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em] sm:text-4xl">
            {firstName ? `Campo agora, ${firstName}` : 'Campo agora'}
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/70">
            Prioridade, risco e deslocamento. Abra o que precisa de ação antes de perder janela no campo.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Rota crítica', 'Carteira própria', 'Alertas vivos'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/75"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <DailySummaryCard
        operatorName={profileQuery.data?.full_name}
        clients={clients}
        visits={visits}
        clientsWithoutRecentVisit={clientsWithoutRecentVisit}
        recentClients={recentClients}
        overdueNextVisits={alerts.overdueNextVisits}
      />

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

      <InsightsCard
        clients={clients}
        visits={visits}
        clientsWithoutRecentVisit={clientsWithoutRecentVisit}
        overdueNextVisits={alerts.overdueNextVisits}
      />

      <TodayAgendaCard events={todayAgendaQuery.data ?? []} />

      <SmartRouteCard
        clientsWithoutRecentVisit={clientsWithoutRecentVisit}
        recentClients={recentClients}
        overdueNextVisits={alerts.overdueNextVisits}
      />

      <DashboardAlertsCard alerts={alerts} />

      <UpcomingVisitsCard events={upcomingWeekAgendaQuery.data ?? []} />

      <ClientsWithoutRecentVisitCard clients={clientsWithoutRecentVisit} />

      <RecentClientsCard clients={recentClients} />

      <QuickActionsCard />
    </div>
  );
}
