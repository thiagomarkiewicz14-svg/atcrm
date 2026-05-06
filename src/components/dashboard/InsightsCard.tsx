import { AlertTriangle, CheckCircle2, Clock3, FileText, Sprout } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildFieldInsights } from '@/lib/portfolio-insights';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';
import type { Visit } from '@/types/visit.types';

interface InsightsCardProps {
  clients: Client[];
  visits: Visit[];
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  overdueNextVisits: AgendaEvent[];
}

export function InsightsCard({
  clients,
  visits,
  clientsWithoutRecentVisit,
  overdueNextVisits,
}: InsightsCardProps) {
  const insights = buildFieldInsights({
    clients,
    visits,
    clientsWithoutRecentVisit,
    overdueNextVisits,
  });
  const isHealthy = insights.riskClients === 0 && insights.overdueVisits === 0;

  return (
    <Card className="border-[#1B4332]/25 bg-[#F3F5F0]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-[#1B4332]">INSIGHTS DO CAMPO</CardTitle>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Sinais rápidos da carteira para o dia de operação.
            </p>
          </div>
          <span
            className={cn(
              'rounded-lg border-2 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em]',
              isHealthy ? 'border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#2E7D32]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#C53030]',
            )}
          >
            {isHealthy ? 'Saudável' : 'Atenção'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InsightMetric
          icon={AlertTriangle}
          label="Clientes em risco"
          value={insights.riskClients}
          tone={insights.riskClients > 0 ? 'risk' : 'healthy'}
          detail="Sem visita acima da janela de 30 dias."
        />
        <InsightMetric
          icon={Clock3}
          label="Visitas atrasadas"
          value={insights.overdueVisits}
          tone={insights.overdueVisits > 0 ? 'risk' : 'healthy'}
          detail="Próximas visitas vencidas e não canceladas."
        />
        <InsightMetric
          icon={Sprout}
          label="Oportunidades abertas"
          value={insights.openOpportunities}
          tone="opportunity"
          detail="Clientes de alto potencial ainda ativos na carteira."
        />
        <InsightMetric
          icon={FileText}
          label="Propostas sem retorno"
          value={insights.proposalsWithoutReturn}
          tone="neutral"
          detail="Aguardando módulo de propostas para leitura real."
        />
        <InsightMetric
          icon={CheckCircle2}
          label="Carteira visitada em 30 dias"
          value={`${insights.visitedPortfolioPercent}%`}
          tone={insights.visitedPortfolioPercent >= 70 ? 'healthy' : 'opportunity'}
          detail="Percentual calculado por visitas registradas."
          className="sm:col-span-2"
        />
      </CardContent>
    </Card>
  );
}

function InsightMetric({
  icon: Icon,
  label,
  value,
  tone,
  detail,
  className,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: number | string;
  tone: 'risk' | 'healthy' | 'opportunity' | 'neutral';
  detail: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-lg border-2 bg-background p-4', getToneClassName(tone), className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black leading-none text-[#1B4332]">{value}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        </div>
        <Icon className={cn('h-5 w-5', tone === 'risk' ? 'text-[#C53030]' : 'text-[#1B4332]')} />
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{detail}</p>
    </div>
  );
}

function getToneClassName(tone: 'risk' | 'healthy' | 'opportunity' | 'neutral') {
  if (tone === 'risk') {
    return 'border-[#FECACA]';
  }

  if (tone === 'healthy') {
    return 'border-[#2E7D32]/30';
  }

  if (tone === 'opportunity') {
    return 'border-[#D4A373]/40';
  }

  return 'border-[#1B4332]/20';
}
