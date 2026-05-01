import type { AgendaEvent } from './agenda.types';
import type { Client } from './client.types';

export interface DashboardSummary {
  totalClients: number;
  activeClients: number;
  prospects: number;
  highPotentialClients: number;
}

export interface DashboardAlerts {
  unreadNotificationsCount: number;
  activeNotificationsCount: number;
  overdueNextVisits: AgendaEvent[];
}

export interface ClientWithoutRecentVisit {
  client: Client;
  last_visit_at: string | null;
}
