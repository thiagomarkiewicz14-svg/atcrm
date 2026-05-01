import { addDays, endOfMonth, getEventsForDay, isSameDay, startOfMonth, startOfWeek } from '@/lib/agenda';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';

interface MonthCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: AgendaEvent[];
  onSelectDate: (date: Date) => void;
}

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' });

export function MonthCalendar({ currentDate, selectedDate, events, onSelectDate }: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart);
  const totalDays = Math.ceil((monthEnd.getTime() - gridStart.getTime()) / 86_400_000) + 1;
  const visibleDays = Math.max(35, Math.ceil(totalDays / 7) * 7);
  const days = Array.from({ length: visibleDays }, (_item, index) => addDays(gridStart, index));
  const weekHeaderDays = Array.from({ length: 7 }, (_item, index) => addDays(gridStart, index));
  const today = new Date();

  return (
    <div className="rounded-2xl border border-border bg-white p-2 shadow-sm">
      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekHeaderDays.map((day) => (
          <span key={day.toISOString()} className="py-2 text-center text-xs font-bold uppercase text-muted-foreground">
            {weekdayFormatter.format(day)}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isOutsideMonth = day.getMonth() !== currentDate.getMonth();
          const hasNextVisit = dayEvents.some((event) => event.type === 'next_visit');

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-center transition-colors duration-200 hover:bg-background',
                isOutsideMonth && 'opacity-40',
                isSelected && 'bg-primary text-primary-foreground opacity-100 shadow-sm hover:bg-primary',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg text-sm font-semibold',
                  isToday && !isSelected && 'border border-primary/35 bg-primary/10 text-primary',
                )}
              >
                {day.getDate()}
              </span>
              {dayEvents.length > 0 ? (
                <span
                  className={cn(
                    'min-w-5 rounded-full px-1 text-[0.62rem] font-semibold',
                    hasNextVisit ? 'bg-[#ED8936]/10 text-[#B85E1B]' : 'bg-primary/10 text-primary',
                    isSelected && 'bg-background/20 text-background',
                  )}
                >
                  {dayEvents.length}
                </span>
              ) : (
                <span className="h-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
