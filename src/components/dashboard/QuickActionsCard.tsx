import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Route, UsersRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const actions = [
  { to: '/clients/new', label: 'Novo cliente', icon: Plus },
  { to: '/visits/new', label: 'Nova visita', icon: Route },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/clients', label: 'Clientes', icon: UsersRound },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={cn(
                'group flex min-h-24 flex-col justify-between rounded-2xl border border-border bg-background p-4 transition-colors duration-200 hover:border-primary/35 hover:bg-white',
              )}
            >
              <action.icon className="h-5 w-5 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="text-sm font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
