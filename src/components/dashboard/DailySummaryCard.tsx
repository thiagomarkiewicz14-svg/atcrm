import { Mail, MessageCircle, SunMedium } from 'lucide-react';

import { SmartRouteCard } from '@/components/dashboard/SmartRouteCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildDailySummary } from '@/lib/daily-summary';
import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';
import type { Visit } from '@/types/visit.types';

interface DailySummaryCardProps {
  operatorName?: string | null;
  clients: Client[];
  visits: Visit[];
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  recentClients: Client[];
  overdueNextVisits: AgendaEvent[];
}

export function DailySummaryCard({
  operatorName,
  clients,
  visits,
  clientsWithoutRecentVisit,
  recentClients,
  overdueNextVisits,
}: DailySummaryCardProps) {
  const summary = buildDailySummary({
    operatorName,
    clients,
    visits,
    clientsWithoutRecentVisit,
    recentClients,
    overdueNextVisits,
  });
  const isEmpty =
    summary.metrics.riskClients === 0 &&
    summary.metrics.recommendedVisits === 0 &&
    summary.metrics.overdueVisits === 0 &&
    summary.metrics.openOpportunities === 0 &&
    summary.metrics.clientsWithoutVisitOver30Days === 0;

  return (
    <Card className="border-[#1B4332]/25 bg-[#F3F5F0]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-[#1B4332]">SEU CAMPO HOJE</CardTitle>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Resumo diário para priorizar carteira, visita e recuperação.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#D4A373]/40 bg-[#D4A373]/20 text-[#7C5E3C]">
            <SunMedium className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEmpty ? (
          <p className="rounded-lg border-2 border-dashed border-[#1B4332]/20 bg-background p-4 text-sm font-bold text-[#1B4332]">
            Carteira sob controle hoje.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <DailyMetric label="Risco" value={summary.metrics.riskClients} tone="risk" />
            <DailyMetric label="Rota" value={summary.metrics.recommendedVisits} tone="field" />
            <DailyMetric label="Atrasos" value={summary.metrics.overdueVisits} tone="risk" />
            <DailyMetric label="Oportunidades" value={summary.metrics.openOpportunities} tone="opportunity" />
            <DailyMetric label="+30 dias" value={summary.metrics.clientsWithoutVisitOver30Days} tone="field" />
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1B4332]">Top 3 prioridades</p>
          <SmartRouteCard
            variant="embedded"
            clientsWithoutRecentVisit={clientsWithoutRecentVisit}
            recentClients={recentClients}
            overdueNextVisits={overdueNextVisits}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t-2 border-[#1B4332]/10 pt-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(summary.text)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#1B4332] px-3 text-xs font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#0F2D22]"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent('Resumo diário ATC CRM')}&body=${encodeURIComponent(summary.text)}`}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border-2 border-[#1B4332] px-3 text-xs font-black uppercase tracking-[0.08em] text-[#1B4332] transition-colors hover:bg-[#1B4332] hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Enviar e-mail
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function DailyMetric({ label, value, tone }: { label: string; value: number; tone: 'risk' | 'field' | 'opportunity' }) {
  return (
    <div className="rounded-lg border-2 border-[#1B4332]/20 bg-background p-3">
      <p className={tone === 'risk' ? 'text-2xl font-black text-[#C53030]' : 'text-2xl font-black text-[#1B4332]'}>
        {value}
      </p>
      <p className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
    </div>
  );
}
