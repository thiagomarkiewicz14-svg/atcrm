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
    <div className="rounded-3xl border border-border bg-card p-2 shadow-[0_18px_48px_rgb(2_6_23/0.22)]">
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
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 text-center transition-all duration-200 hover:bg-muted',
                isOutsideMonth && 'opacity-40',
                isSelected && 'bg-primary text-primary-foreground opacity-100 shadow-[0_10px_24px_rgb(34_197_94/0.2)] hover:bg-primary',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-xl text-sm font-black',
                  isToday && !isSelected && 'border border-primary/35 bg-primary/10 text-primary',
                )}
              >
                {day.getDate()}
              </span>
              {dayEvents.length > 0 ? (
                <span
                  className={cn(
                    'min-w-5 rounded-full px-1 text-[0.62rem] font-black',
                    hasNextVisit ? 'bg-amber-400/15 text-amber-300' : 'bg-primary/10 text-primary',
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
