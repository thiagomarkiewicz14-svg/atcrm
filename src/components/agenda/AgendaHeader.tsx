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
    <div className="rounded-xl border-2 border-[#1B4332] bg-[#1B4332] p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4A373]">Rota de campo</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">Agenda</h1>
          <p className="mt-1 truncate text-sm font-medium capitalize text-white/70">{title}</p>
        </div>

        <Button type="button" variant="secondary" size="sm" onClick={onToday} className="border-white bg-white text-[#1B4332] hover:bg-[#D4A373]">
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

        <div className="grid grid-cols-2 rounded-lg border-2 border-white/20 bg-white/10 p-1">
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
        'h-9 rounded-md px-3 text-xs font-black uppercase tracking-[0.08em] text-white/65 transition-colors duration-150',
        isActive && 'bg-[#D4A373] text-[#1B4332]',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
