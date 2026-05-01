import { CalendarDays } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function AgendaEmptyState() {
  return (
    <Card>
      <CardContent className="flex min-h-36 flex-col items-center justify-center gap-3 p-5 text-center">
        <CalendarDays className="h-8 w-8 text-primary" />
        <div className="space-y-1">
          <h3 className="text-base font-bold">Dia livre na agenda</h3>
          <p className="text-sm text-muted-foreground">Crie uma visita ou selecione outro dia com compromisso.</p>
        </div>
      </CardContent>
    </Card>
  );
}
