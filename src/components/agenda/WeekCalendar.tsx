import { addDays, getEventsForDay, isSameDay, startOfWeek } from '@/lib/agenda';
import { cn } from '@/lib/utils';
import type { AgendaEvent } from '@/types/agenda.types';

interface WeekCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: AgendaEvent[];
  onSelectDate: (date: Date) => void;
}

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

export function WeekCalendar({ currentDate, selectedDate, events, onSelectDate }: WeekCalendarProps) {
  const weekStart = startOfWeek(currentDate);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_item, index) => addDays(weekStart, index));

  return (
    <div className="rounded-2xl border border-border bg-white p-2 shadow-sm">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                'flex min-h-24 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition-colors duration-200 hover:bg-background',
                isSelected && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary',
              )}
            >
              <span className={cn('text-[0.68rem] font-bold uppercase', !isSelected && 'text-muted-foreground')}>
                {weekdayFormatter.format(day).replace('.', '')}
              </span>
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold',
                  isToday && !isSelected && 'border border-primary/35 bg-primary/10 text-primary',
                )}
              >
                {day.getDate()}
              </span>
              <EventDots events={dayEvents} isSelected={isSelected} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventDots({ events, isSelected }: { events: AgendaEvent[]; isSelected: boolean }) {
  if (events.length === 0) {
    return <span className="h-2" />;
  }

  return (
    <span className="flex items-center justify-center gap-1">
      {events.slice(0, 3).map((event) => (
        <span
          key={event.id}
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            event.type === 'next_visit' ? 'bg-amber-400' : 'bg-primary',
            isSelected && 'bg-background',
          )}
        />
      ))}
      {events.length > 3 ? (
        <span className={cn('text-[0.6rem] font-semibold text-primary', isSelected && 'text-background')}>
          +{events.length - 3}
        </span>
      ) : null}
    </span>
  );
}
