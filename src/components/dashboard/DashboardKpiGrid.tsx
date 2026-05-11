import { AlertTriangle, TrendingUp, UserCheck, UsersRound } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { DashboardSummary } from '@/types/dashboard.types';

interface DashboardKpiGridProps {
  summary: DashboardSummary;
}

const kpis = [
  { key: 'totalClients', label: 'Carteira', icon: UsersRound, tone: 'text-white', panel: 'bg-[#1E3A2F] text-white' },
  { key: 'prospects', label: 'Prospects', icon: TrendingUp, tone: 'text-[#1E3A2F]', panel: 'bg-[#C8A951] text-[#1E3A2F]' },
  { key: 'activeClients', label: 'Ativos', icon: UserCheck, tone: 'text-white', panel: 'bg-[#2D6A4F] text-white' },
  { key: 'highPotentialClients', label: 'Alto risco/oportunidade', icon: AlertTriangle, tone: 'text-white', panel: 'bg-[#C53030] text-white' },
] as const;

export function DashboardKpiGrid({ summary }: DashboardKpiGridProps) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((item) => (
        <Card key={item.key} className={`overflow-hidden border-0 shadow-[0_10px_24px_rgba(30,58,47,0.10)] ${item.panel}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-black leading-none">{summary[item.key]}</p>
                <p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.12em] opacity-75">{item.label}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-white/10">
                <item.icon className={`h-5 w-5 ${item.tone}`} />
              </div>
            </div>
            <div className="mt-4 h-1 rounded-full bg-current opacity-20" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
