import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPinned, Navigation, Route } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSmartRouteSuggestions, type RoutePriorityBadge, type RouteSuggestion } from '@/lib/route-intelligence';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';
import type { Client } from '@/types/client.types';
import type { ClientWithoutRecentVisit } from '@/types/dashboard.types';

interface SmartRouteCardProps {
  clientsWithoutRecentVisit: ClientWithoutRecentVisit[];
  recentClients: Client[];
  overdueNextVisits: AgendaEvent[];
}

const badgeClassNames: Record<RoutePriorityBadge, string> = {
  'ALTO RISCO': 'border-[#FECACA] bg-[#FEF2F2] text-[#C53030]',
  OPORTUNIDADE: 'border-[#D4A373]/40 bg-[#D4A373]/20 text-[#7C5E3C]',
  RECUPERAR: 'border-[#1B4332]/20 bg-[#1B4332]/10 text-[#1B4332]',
};

export function SmartRouteCard({
  clientsWithoutRecentVisit,
  recentClients,
  overdueNextVisits,
}: SmartRouteCardProps) {
  const suggestions = buildSmartRouteSuggestions({
    clientsWithoutRecentVisit,
    recentClients,
    overdueNextVisits,
  });

  return (
    <Card className="border-[#1B4332]/25 bg-[#F3F5F0]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-[#1B4332]">ROTA INTELIGENTE HOJE</CardTitle>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Prioridade sugerida para não perder janela no campo.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#1B4332]/20 bg-[#1B4332]/10 text-[#1B4332]">
            <Navigation className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-[#1B4332]/20 bg-background p-4">
            <p className="text-sm font-bold text-[#1B4332]">Carteira está sob controle hoje.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sem atraso ou recuperação crítica nos dados carregados do Dashboard.
            </p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <SmartRouteItem key={suggestion.clientId} position={index + 1} suggestion={suggestion} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function SmartRouteItem({ position, suggestion }: { position: number; suggestion: RouteSuggestion }) {
  const navigate = useNavigate();
  const clientHref = `/clients/${suggestion.clientId}`;
  const visitHref = `/visits/new?clientId=${suggestion.clientId}`;
  const actionHref = suggestion.action === 'start_visit' ? visitHref : clientHref;
  const actionLabel = suggestion.action === 'start_visit' ? 'Iniciar visita' : 'Abrir cliente';
  const openClient = () => navigate(clientHref);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openClient();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openClient}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-lg border-2 border-[#1B4332]/20 bg-background p-4 transition-all duration-150 hover:border-[#1B4332]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]/30"
      aria-label={`Abrir cliente ${suggestion.clientName}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B4332] text-sm font-black text-white">
          {position}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="line-clamp-1 text-base font-black uppercase tracking-[0.02em] text-[#1B4332]">
                {suggestion.clientName}
              </p>
              {suggestion.farmName || suggestion.location ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                  <MapPinned className="h-3.5 w-3.5" />
                  <span className="truncate">{suggestion.farmName ?? suggestion.location}</span>
                </p>
              ) : null}
            </div>
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-[0.66rem] font-black uppercase tracking-[0.08em]',
                badgeClassNames[suggestion.badge],
              )}
            >
              {suggestion.badge}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[#1B4332]">{suggestion.reason}</p>
            <p className="line-clamp-2 text-xs font-medium text-muted-foreground">
              {suggestion.reasons.join(' · ')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#1B4332]/10 pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#7C5E3C]">
              <Route className="h-3.5 w-3.5" />
              {suggestion.estimatedDistanceKm} km estimados
            </span>
            <Link
              to={actionHref}
              onClick={(event) => {
                event.stopPropagation();
              }}
              className={cn(
                'inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-xs font-black uppercase tracking-[0.08em] transition-colors duration-150',
                suggestion.action === 'start_visit'
                  ? 'bg-[#1B4332] text-white hover:bg-[#0F2D22]'
                  : 'border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white',
              )}
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
