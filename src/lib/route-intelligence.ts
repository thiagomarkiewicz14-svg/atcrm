import type { AgendaEvent } from '@/types/agenda.types';
import type { Client, CommercialPotential, ClientStatus } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';

const DAY_IN_MS = 86_400_000;

export type RoutePriorityBadge = 'ALTO RISCO' | 'OPORTUNIDADE' | 'RECUPERAR';

export type RoutePriorityAction = 'start_visit' | 'open_client';

export interface RouteSuggestion {
  clientId: string;
  clientName: string;
  farmName: string | null;
  location: string | null;
  badge: RoutePriorityBadge;
  score: number;
  reason: string;
  reasons: string[];
  estimatedDistanceKm: number;
  action: RoutePriorityAction;
}

export interface BuildRouteSuggestionsInput {
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  recentClients: Client[];
  overdueNextVisits: AgendaEvent[];
  today?: Date;
}

interface RouteCandidate {
  clientId: string;
  clientName: string;
  farmName: string | null;
  city: string | null;
  state: string | null;
  lastVisitAt: string | null;
  createdAt: string | null;
  status: ClientStatus | null;
  commercialPotential: CommercialPotential | null;
  hasOverdueVisit: boolean;
  overdueStartsAt: string | null;
}

interface RouteScoreInput {
  daysWithoutVisit: number;
  daysOverdue: number;
  status: ClientStatus | null;
  commercialPotential: CommercialPotential | null;
  hasOverdueVisit: boolean;
  estimatedDistanceKm: number;
}

export function calculateRouteScore({
  daysWithoutVisit,
  daysOverdue,
  status,
  commercialPotential,
  hasOverdueVisit,
  estimatedDistanceKm,
}: RouteScoreInput) {
  const overdueBonus = hasOverdueVisit ? 110 + daysOverdue * 4 : 0;
  const activeBonus = status === 'active' ? 18 : 0;
  const opportunityBonus = commercialPotential === 'high' ? 32 : 0;
  const distancePenalty = estimatedDistanceKm * 0.35;

  return Math.round(daysWithoutVisit * 2 + overdueBonus + activeBonus + opportunityBonus - distancePenalty);
}

export function buildSmartRouteSuggestions({
  clientsWithoutRecentVisit,
  recentClients,
  overdueNextVisits,
  today = new Date(),
}: BuildRouteSuggestionsInput): RouteSuggestion[] {
  const candidates = new Map<string, RouteCandidate>();

  clientsWithoutRecentVisit.forEach(({ client, last_visit_at }) => {
    candidates.set(client.id, buildCandidateFromClient(client, last_visit_at));
  });

  recentClients.forEach((client) => {
    if (!candidates.has(client.id)) {
      candidates.set(client.id, buildCandidateFromClient(client, null));
    }
  });

  overdueNextVisits.forEach((event) => {
    const current = candidates.get(event.client_id);

    candidates.set(event.client_id, {
      clientId: event.client_id,
      clientName: current?.clientName ?? event.client_name,
      farmName: event.farm_name ?? current?.farmName ?? null,
      city: current?.city ?? null,
      state: current?.state ?? null,
      lastVisitAt: current?.lastVisitAt ?? null,
      createdAt: current?.createdAt ?? null,
      status: current?.status ?? null,
      commercialPotential: current?.commercialPotential ?? null,
      hasOverdueVisit: true,
      overdueStartsAt: event.starts_at,
    });
  });

  return [...candidates.values()]
    .map((candidate) => buildSuggestion(candidate, today))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildCandidateFromClient(client: Client, lastVisitAt: string | null): RouteCandidate {
  return {
    clientId: client.id,
    clientName: client.name,
    farmName: client.farm_name,
    city: client.city,
    state: client.state,
    lastVisitAt,
    createdAt: client.created_at,
    status: client.status,
    commercialPotential: client.commercial_potential,
    hasOverdueVisit: false,
    overdueStartsAt: null,
  };
}

function buildSuggestion(candidate: RouteCandidate, today: Date): RouteSuggestion {
  const daysWithoutVisit = getDaysWithoutVisit(candidate, today);
  const daysOverdue = candidate.overdueStartsAt ? getPositiveDaysBetween(candidate.overdueStartsAt, today) : 0;
  // Distância real ainda não está disponível nos dados do Dashboard; esta estimativa é visual e determinística por cliente.
  const estimatedDistanceKm = estimateDistanceKm(candidate.clientId);
  const score = calculateRouteScore({
    daysWithoutVisit,
    daysOverdue,
    status: candidate.status,
    commercialPotential: candidate.commercialPotential,
    hasOverdueVisit: candidate.hasOverdueVisit,
    estimatedDistanceKm,
  });
  const reasons = getPriorityReasons(candidate, daysWithoutVisit);

  return {
    clientId: candidate.clientId,
    clientName: candidate.clientName,
    farmName: candidate.farmName,
    location: [candidate.city, candidate.state].filter(Boolean).join(' / ') || null,
    badge: getPriorityBadge(candidate),
    score,
    reason: reasons[0] ?? 'distância estimada',
    reasons,
    estimatedDistanceKm,
    action: candidate.hasOverdueVisit || daysWithoutVisit >= 30 ? 'start_visit' : 'open_client',
  };
}

function getDaysWithoutVisit(candidate: RouteCandidate, today: Date) {
  const baseDate = candidate.lastVisitAt ?? candidate.createdAt;

  if (!baseDate) {
    return candidate.hasOverdueVisit ? 45 : 0;
  }

  const days = getPositiveDaysBetween(baseDate, today);
  return candidate.lastVisitAt ? days : Math.max(days, candidate.hasOverdueVisit ? 45 : 15);
}

function getPositiveDaysBetween(dateIso: string, today: Date) {
  const elapsed = today.getTime() - new Date(dateIso).getTime();
  return Math.max(0, Math.ceil(elapsed / DAY_IN_MS));
}

function getPriorityBadge(candidate: RouteCandidate): RoutePriorityBadge {
  if (candidate.hasOverdueVisit) {
    return 'ALTO RISCO';
  }

  if (candidate.commercialPotential === 'high') {
    return 'OPORTUNIDADE';
  }

  return 'RECUPERAR';
}

function getPriorityReasons(candidate: RouteCandidate, daysWithoutVisit: number) {
  const reasons: string[] = [];

  if (candidate.hasOverdueVisit) {
    reasons.push('visita atrasada');
  }

  if (candidate.lastVisitAt) {
    reasons.push(`sem visita recente há ${daysWithoutVisit} dias`);
  } else {
    reasons.push('sem visita registrada');
  }

  if (candidate.status === 'active') {
    reasons.push('cliente ativo');
  }

  if (candidate.commercialPotential === 'high') {
    reasons.push('alto potencial');
  }

  reasons.push('distância estimada');

  return reasons;
}

function estimateDistanceKm(clientId: string) {
  const hash = [...clientId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return 8 + (hash % 58);
}
