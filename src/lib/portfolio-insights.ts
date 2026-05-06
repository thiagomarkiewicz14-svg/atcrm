import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';
import type { Visit } from '@/types/visit.types';

const DAY_IN_MS = 86_400_000;
const DEFAULT_RISK_DAYS = 30;

export type PortfolioHealthStatus = 'OK' | 'EM RISCO' | 'CRÍTICO';

export interface PortfolioReportRow {
  client: Client;
  lastVisitAt: string | null;
  daysWithoutVisit: number;
  healthStatus: PortfolioHealthStatus;
  visitsInPeriod: number;
  openOpportunities: number;
  proposalsWithoutReturn: number;
  lastInteractionAt: string | null;
}

export interface PortfolioReportSummary {
  totalClients: number;
  activePortfolioPercent: number;
  visitedPortfolioPercent: number;
  withoutVisitPercent: number;
  riskClients: number;
  criticalClients: number;
  openOpportunities: number;
  proposalsWithoutReturn: number;
}

export interface PortfolioReportFilters {
  periodDays: number;
  healthStatus: PortfolioHealthStatus | 'all';
  city: string | 'all';
}

export interface PortfolioReport {
  rows: PortfolioReportRow[];
  summary: PortfolioReportSummary;
  cityOptions: string[];
}

export interface FieldInsights {
  riskClients: number;
  overdueVisits: number;
  openOpportunities: number;
  proposalsWithoutReturn: number;
  visitedPortfolioPercent: number;
  clientsWithoutVisitOver30Days: number;
}

export function buildPortfolioReport(
  clients: Client[],
  visits: Visit[],
  filters: PortfolioReportFilters,
  today = new Date(),
): PortfolioReport {
  const cityOptions = [...new Set(clients.map((client) => client.city).filter(isFilledString))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
  const cutoff = new Date(today.getTime() - filters.periodDays * DAY_IN_MS);
  const visitsByClient = groupVisitsByClient(visits);

  const rows = clients
    .map((client) => buildPortfolioRow(client, visitsByClient.get(client.id) ?? [], cutoff, filters.periodDays, today))
    .filter((row) => filters.healthStatus === 'all' || row.healthStatus === filters.healthStatus)
    .filter((row) => filters.city === 'all' || row.client.city === filters.city)
    .sort((a, b) => b.daysWithoutVisit - a.daysWithoutVisit);

  const allRows = clients.map((client) =>
    buildPortfolioRow(client, visitsByClient.get(client.id) ?? [], cutoff, filters.periodDays, today),
  );

  return {
    rows,
    summary: buildPortfolioSummary(clients, allRows),
    cityOptions,
  };
}

export function buildFieldInsights({
  clients,
  visits,
  clientsWithoutRecentVisit,
  overdueNextVisits,
  periodDays = DEFAULT_RISK_DAYS,
  today = new Date(),
}: {
  clients: Client[];
  visits: Visit[];
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  overdueNextVisits: AgendaEvent[];
  periodDays?: number;
  today?: Date;
}): FieldInsights {
  const report = buildPortfolioReport(clients, visits, {
    periodDays,
    healthStatus: 'all',
    city: 'all',
  }, today);

  return {
    riskClients: Math.max(report.summary.riskClients, clientsWithoutRecentVisit.length),
    overdueVisits: overdueNextVisits.length,
    openOpportunities: report.summary.openOpportunities,
    proposalsWithoutReturn: report.summary.proposalsWithoutReturn,
    visitedPortfolioPercent: report.summary.visitedPortfolioPercent,
    clientsWithoutVisitOver30Days: clientsWithoutRecentVisit.length,
  };
}

function buildPortfolioRow(
  client: Client,
  clientVisits: Visit[],
  cutoff: Date,
  periodDays: number,
  today: Date,
): PortfolioReportRow {
  const sortedVisits = [...clientVisits].sort(
    (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime(),
  );
  const lastVisit = sortedVisits[0] ?? null;
  const lastVisitAt = lastVisit?.visit_date ?? null;
  const daysWithoutVisit = lastVisitAt
    ? getPositiveDaysBetween(lastVisitAt, today)
    : getPositiveDaysBetween(client.created_at, today);
  const visitsInPeriod = sortedVisits.filter((visit) => new Date(visit.visit_date).getTime() >= cutoff.getTime()).length;
  const lastInteractionAt = lastVisitAt ?? client.updated_at ?? client.created_at;

  return {
    client,
    lastVisitAt,
    daysWithoutVisit,
    healthStatus: getHealthStatus(lastVisitAt, daysWithoutVisit, periodDays),
    visitsInPeriod,
    openOpportunities: client.commercial_potential === 'high' && client.status !== 'lost' ? 1 : 0,
    proposalsWithoutReturn: 0,
    lastInteractionAt,
  };
}

function buildPortfolioSummary(clients: Client[], rows: PortfolioReportRow[]): PortfolioReportSummary {
  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.status === 'active').length;
  const visitedClients = rows.filter((row) => row.lastVisitAt !== null && row.daysWithoutVisit <= DEFAULT_RISK_DAYS).length;
  const riskClients = rows.filter((row) => row.healthStatus !== 'OK').length;

  return {
    totalClients,
    activePortfolioPercent: getPercent(activeClients, totalClients),
    visitedPortfolioPercent: getPercent(visitedClients, totalClients),
    withoutVisitPercent: getPercent(totalClients - visitedClients, totalClients),
    riskClients,
    criticalClients: rows.filter((row) => row.healthStatus === 'CRÍTICO').length,
    openOpportunities: rows.reduce((total, row) => total + row.openOpportunities, 0),
    proposalsWithoutReturn: rows.reduce((total, row) => total + row.proposalsWithoutReturn, 0),
  };
}

function groupVisitsByClient(visits: Visit[]) {
  const visitsByClient = new Map<string, Visit[]>();

  visits.forEach((visit) => {
    const current = visitsByClient.get(visit.client_id) ?? [];
    current.push(visit);
    visitsByClient.set(visit.client_id, current);
  });

  return visitsByClient;
}

function getHealthStatus(lastVisitAt: string | null, daysWithoutVisit: number, periodDays: number): PortfolioHealthStatus {
  if (!lastVisitAt || daysWithoutVisit > periodDays * 2) {
    return 'CRÍTICO';
  }

  if (daysWithoutVisit > periodDays) {
    return 'EM RISCO';
  }

  return 'OK';
}

function getPositiveDaysBetween(dateIso: string, today: Date) {
  const elapsed = today.getTime() - new Date(dateIso).getTime();
  return Math.max(0, Math.ceil(elapsed / DAY_IN_MS));
}

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function isFilledString(value: string | null): value is string {
  return Boolean(value?.trim());
}
