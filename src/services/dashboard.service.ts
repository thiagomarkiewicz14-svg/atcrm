import { addDays, buildAgendaEventsFromVisits, endOfDay, startOfDay } from '@/lib/agenda';
import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit, DashboardAlerts, DashboardSummary } from '@/types/dashboard.types';
import type { Visit } from '@/types/visit.types';

import { agendaService } from './agenda.service';
import { supabase } from './supabase';

type ClientSummaryRow = Pick<Client, 'status' | 'commercial_potential'>;
type VisitContactRow = Pick<Visit, 'client_id' | 'visit_date'>;
type NotificationCountRow = { id: string };
type UserAlertSettingsRow = { enable_overdue_visit_alerts: boolean };

const dashboardVisitSelect = `
  *,
  clients:client_id(id,name,city,state),
  farms:farm_id(id,name,city,state)
`;

function getTodayRange() {
  const today = new Date();
  return {
    startDate: startOfDay(today).toISOString(),
    endDate: endOfDay(today).toISOString(),
  };
}

function getUpcomingWeekRange() {
  const now = new Date();
  return {
    startDate: now.toISOString(),
    endDate: endOfDay(addDays(now, 7)).toISOString(),
  };
}

function sortAgendaEvents(events: AgendaEvent[]) {
  return [...events].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
}

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const { data, error } = await supabase
      .from('clients')
      .select('status, commercial_potential')
      .is('deleted_at', null)
      .returns<ClientSummaryRow[]>();

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    return {
      totalClients: rows.length,
      activeClients: rows.filter((client) => client.status === 'active').length,
      prospects: rows.filter((client) => client.status === 'prospect').length,
      highPotentialClients: rows.filter((client) => client.commercial_potential === 'high').length,
    };
  },

  async getTodayAgenda(): Promise<AgendaEvent[]> {
    return agendaService.listAgendaEvents(getTodayRange());
  },

  async getUpcomingWeekAgenda(): Promise<AgendaEvent[]> {
    return agendaService.listAgendaEvents(getUpcomingWeekRange());
  },

  async getDashboardAlerts(): Promise<DashboardAlerts> {
    const nowIso = new Date().toISOString();

    const [unreadNotificationsResult, activeNotificationsResult, overdueVisitsResult, settingsResult] = await Promise.all([
      supabase
        .from('notifications')
        .select('id')
        .is('read_at', null)
        .or(`scheduled_for.is.null,scheduled_for.lte.${nowIso}`)
        .returns<NotificationCountRow[]>(),
      supabase
        .from('notifications')
        .select('id')
        .or(`scheduled_for.is.null,scheduled_for.lte.${nowIso}`)
        .returns<NotificationCountRow[]>(),
      supabase
        .from('visits')
        .select(dashboardVisitSelect)
        .is('deleted_at', null)
        .not('next_visit_at', 'is', null)
        .lt('next_visit_at', nowIso)
        .neq('status', 'canceled')
        .order('next_visit_at', { ascending: true })
        .limit(5)
        .returns<Visit[]>(),
      supabase
        .from('user_settings')
        .select('enable_overdue_visit_alerts')
        .returns<UserAlertSettingsRow[]>()
        .maybeSingle(),
    ]);

    if (unreadNotificationsResult.error) throw unreadNotificationsResult.error;
    if (activeNotificationsResult.error) throw activeNotificationsResult.error;
    if (overdueVisitsResult.error) throw overdueVisitsResult.error;
    if (settingsResult.error) throw settingsResult.error;

    const showOverdueVisits = settingsResult.data?.enable_overdue_visit_alerts ?? true;
    const overdueNextVisits = showOverdueVisits
      ? buildAgendaEventsFromVisits(overdueVisitsResult.data ?? [])
          .filter((event) => event.type === 'next_visit')
          .slice(0, 5)
      : [];

    return {
      unreadNotificationsCount: unreadNotificationsResult.data?.length ?? 0,
      activeNotificationsCount: activeNotificationsResult.data?.length ?? 0,
      overdueNextVisits,
    };
  },

  async getClientsWithoutRecentVisit(): Promise<ClientWithoutRecentVisit[]> {
    const cutoffIso = addDays(new Date(), -30).toISOString();

    const [clientsResult, visitsResult] = await Promise.all([
      supabase
        .from('clients')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .returns<Client[]>(),
      supabase
        .from('visits')
        .select('client_id, visit_date')
        .is('deleted_at', null)
        .returns<VisitContactRow[]>(),
    ]);

    if (clientsResult.error) throw clientsResult.error;
    if (visitsResult.error) throw visitsResult.error;

    const lastVisitByClient = new Map<string, string>();

    (visitsResult.data ?? []).forEach((visit) => {
      const currentLastVisit = lastVisitByClient.get(visit.client_id);

      if (!currentLastVisit || new Date(visit.visit_date).getTime() > new Date(currentLastVisit).getTime()) {
        lastVisitByClient.set(visit.client_id, visit.visit_date);
      }
    });

    return (clientsResult.data ?? [])
      .map<ClientWithoutRecentVisit>((client) => ({
        client,
        last_visit_at: lastVisitByClient.get(client.id) ?? null,
      }))
      .filter((item) => !item.last_visit_at || item.last_visit_at < cutoffIso)
      .sort((a, b) => {
        if (a.last_visit_at === null && b.last_visit_at !== null) return -1;
        if (a.last_visit_at !== null && b.last_visit_at === null) return 1;
        if (a.last_visit_at === null && b.last_visit_at === null) {
          return new Date(a.client.created_at).getTime() - new Date(b.client.created_at).getTime();
        }

        const aLastVisitAt = a.last_visit_at ?? a.client.created_at;
        const bLastVisitAt = b.last_visit_at ?? b.client.created_at;
        return new Date(aLastVisitAt).getTime() - new Date(bLastVisitAt).getTime();
      })
      .slice(0, 5);
  },

  async getRecentClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<Client[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },
};
