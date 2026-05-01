import { AlertTriangle, TrendingUp, UserCheck, UsersRound } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { DashboardSummary } from '@/types/dashboard.types';

interface DashboardKpiGridProps {
  summary: DashboardSummary;
}

const kpis = [
  { key: 'totalClients', label: 'Clientes', icon: UsersRound, tone: 'text-primary' },
  { key: 'prospects', label: 'Prospects', icon: TrendingUp, tone: 'text-[#D4A373]' },
  { key: 'activeClients', label: 'Ativos', icon: UserCheck, tone: 'text-[#2E7D32]' },
  { key: 'highPotentialClients', label: 'Alto potencial', icon: AlertTriangle, tone: 'text-[#ED8936]' },
] as const;

export function DashboardKpiGrid({ summary }: DashboardKpiGridProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((item) => (
        <Card key={item.key} className="overflow-hidden">
          <CardContent className="relative p-4">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold leading-none">{summary[item.key]}</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">{item.label}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background">
                <item.icon className={`h-5 w-5 ${item.tone}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
