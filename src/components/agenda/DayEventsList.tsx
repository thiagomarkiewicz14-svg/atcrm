import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { AgendaEventCard } from '@/components/agenda/AgendaEventCard';
import { getEventsForDay } from '@/lib/agenda';
import type { AgendaEvent } from '@/types/agenda.types';

interface DayEventsListProps {
  selectedDate: Date;
  events: AgendaEvent[];
}

const titleFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export function DayEventsList({ selectedDate, events }: DayEventsListProps) {
  const dayEvents = getEventsForDay(events, selectedDate);

  return (
    <section className="space-y-3">
      <div className="border-l-4 border-[#D4A373] pl-3">
        <h2 className="text-xl font-black uppercase tracking-[0.04em] text-[#1B4332]">{titleFormatter.format(selectedDate)}</h2>
        <p className="text-sm font-semibold text-muted-foreground">
          {dayEvents.length} compromisso{dayEvents.length === 1 ? '' : 's'} no dia.
        </p>
      </div>

      {dayEvents.length === 0 ? (
        <AgendaEmptyState />
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <AgendaEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
