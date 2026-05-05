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
      <section className="relative overflow-hidden rounded-xl border-2 border-[#1B4332] bg-[#1B4332] p-5 text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative">
          <Logo variant="compact" className="mb-5 text-white [&_span:first-child]:border-white/20 [&_span:first-child]:bg-white/10 [&_span:last-child]:text-white" />
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4A373]">{dayFormatter.format(new Date())}</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">
            {firstName ? `Campo agora, ${firstName}` : 'Campo agora'}
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/70">
            Prioridade, risco e deslocamento. Abra o que precisa de ação antes de perder janela no campo.
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
