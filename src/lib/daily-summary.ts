import { buildFieldInsights } from '@/lib/portfolio-insights';
import { buildSmartRouteSuggestions } from '@/lib/route-intelligence';
import { clientsService } from '@/services/clients.service';
import { dashboardService } from '@/services/dashboard.service';
import { profileService } from '@/services/profile.service';
import { visitsService } from '@/services/visits.service';
import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';
import type { Visit } from '@/types/visit.types';

export interface DailySummaryInput {
  operatorName?: string | null;
  clients: Client[];
  visits: Visit[];
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  overdueNextVisits: AgendaEvent[];
  recentClients: Client[];
}

export interface DailySummaryResult {
  text: string;
  html: string;
  metrics: {
    riskClients: number;
    recommendedVisits: number;
    overdueVisits: number;
    openOpportunities: number;
    proposalsWithoutReturn: number;
    clientsWithoutVisitOver30Days: number;
  };
  priorities: string[];
}

export async function generateDailySummary(userId: string): Promise<DailySummaryResult> {
  const normalizedUserId = userId.trim();
  const [profile, clients, visits, clientsWithoutRecentVisit, recentClients, alerts] = await Promise.all([
    profileService.getCurrentProfile(),
    clientsService.listClients(),
    visitsService.listVisits(),
    dashboardService.getClientsWithoutRecentVisit(),
    dashboardService.getRecentClients(),
    dashboardService.getDashboardAlerts(),
  ]);

  return buildDailySummary({
    operatorName: profile?.full_name ?? normalizedUserId,
    clients,
    visits,
    clientsWithoutRecentVisit,
    recentClients,
    overdueNextVisits: alerts.overdueNextVisits,
  });
}

export function buildDailySummary({
  operatorName,
  clients,
  visits,
  clientsWithoutRecentVisit,
  overdueNextVisits,
  recentClients,
}: DailySummaryInput): DailySummaryResult {
  const insights = buildFieldInsights({
    clients,
    visits,
    clientsWithoutRecentVisit,
    overdueNextVisits,
  });
  const priorities = buildSmartRouteSuggestions({
    clientsWithoutRecentVisit,
    recentClients,
    overdueNextVisits,
  });
  const priorityNames = priorities.map((priority) => priority.clientName);
  const firstName = operatorName?.trim().split(' ')[0] || 'operador';

  const metrics = {
    riskClients: insights.riskClients,
    recommendedVisits: priorities.length,
    overdueVisits: insights.overdueVisits,
    openOpportunities: insights.openOpportunities,
    proposalsWithoutReturn: insights.proposalsWithoutReturn,
    clientsWithoutVisitOver30Days: insights.clientsWithoutVisitOver30Days,
  };

  const priorityLines =
    priorityNames.length > 0
      ? priorityNames.map((name, index) => `${index + 1}. ${name}`).join('\n')
      : 'Carteira sob controle hoje.';

  const text = `Bom dia, ${firstName}.

Seu campo hoje:

🚨 ${metrics.riskClients} clientes em risco
📍 ${metrics.recommendedVisits} visitas recomendadas
⏰ ${metrics.overdueVisits} atrasos
🌱 ${metrics.openOpportunities} oportunidades
📄 ${metrics.proposalsWithoutReturn} propostas

Prioridade:
${priorityLines}`;

  const html = `
    <section style="font-family: Inter, Arial, sans-serif; color: #111111;">
      <h1 style="color: #1E3A2F;">Bom dia, ${escapeHtml(firstName)}.</h1>
      <h2>Seu campo hoje</h2>
      <ul>
        <li><strong>${metrics.riskClients}</strong> clientes em risco</li>
        <li><strong>${metrics.recommendedVisits}</strong> visitas recomendadas</li>
        <li><strong>${metrics.overdueVisits}</strong> atrasos</li>
        <li><strong>${metrics.openOpportunities}</strong> oportunidades</li>
        <li><strong>${metrics.proposalsWithoutReturn}</strong> propostas</li>
      </ul>
      <h2>Prioridade</h2>
      <ol>${priorityNames.map((name) => `<li>${escapeHtml(name)}</li>`).join('') || '<li>Carteira sob controle hoje.</li>'}</ol>
    </section>
  `.trim();

  return {
    text,
    html,
    metrics,
    priorities: priorityNames,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
