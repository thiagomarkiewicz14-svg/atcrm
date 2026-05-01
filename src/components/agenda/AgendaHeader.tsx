import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AgendaViewMode } from '@/types/agenda.types';

interface AgendaHeaderProps {
  title: string;
  mode: AgendaViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onModeChange: (mode: AgendaViewMode) => void;
}

export function AgendaHeader({
  title,
  mode,
  onPrevious,
  onNext,
  onToday,
  onModeChange,
}: AgendaHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Agenda</h1>
          <p className="mt-1 truncate text-sm font-medium capitalize text-muted-foreground">{title}</p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onToday}>
          Hoje
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={onPrevious} aria-label="Período anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onNext} aria-label="Próximo período">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 rounded-xl border border-border bg-background p-1">
          <ModeButton isActive={mode === 'week'} onClick={() => onModeChange('week')}>
            Semana
          </ModeButton>
          <ModeButton isActive={mode === 'month'} onClick={() => onModeChange('month')}>
            Mês
          </ModeButton>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        'h-9 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors duration-200',
        isActive && 'bg-primary text-primary-foreground shadow-sm',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
