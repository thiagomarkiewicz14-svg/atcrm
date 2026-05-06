import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Route, UsersRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const actions = [
  { to: '/clients/new', label: 'Cadastrar alvo', action: 'Novo cliente', icon: Plus },
  { to: '/visits/new', label: 'Ir agora', action: 'Nova visita', icon: Route },
  { to: '/agenda', label: 'Checar rota', action: 'Agenda', icon: CalendarDays },
  { to: '/clients', label: 'Recuperar carteira', action: 'Clientes', icon: UsersRound },
];

export function QuickActionsCard() {
  return (
    <Card className="border-[#1E3A2F] bg-[#1E3A2F] text-white">
      <CardHeader>
        <CardTitle>Ações de campo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex min-h-24 flex-col justify-between rounded-lg border-2 border-white/20 bg-white/10 p-4 transition-colors hover:border-[#C8A951]"
            >
              <action.icon className="h-5 w-5 text-[#C8A951]" />
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.08em]">{action.label}</span>
                <span className="mt-1 block text-xs font-medium text-white/60">{action.action}</span>
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
