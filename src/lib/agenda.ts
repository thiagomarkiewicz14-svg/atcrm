import type { AgendaColorVariant, AgendaEvent } from '@/types/agenda.types';
import type { Visit, VisitStatus } from '@/types/visit.types';

export function startOfWeek(date: Date) {
  const nextDate = startOfDay(date);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + diff);
  return nextDate;
}

export function endOfWeek(date: Date) {
  const nextDate = startOfWeek(date);
  nextDate.setDate(nextDate.getDate() + 6);
  return endOfDay(nextDate);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function addWeeks(date: Date, amount: number) {
  return addDays(date, amount * 7);
}

export function addMonths(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + amount);
  return nextDate;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatAgendaDay(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function formatAgendaWeekRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${start.getDate()} a ${end.getDate()} de ${new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(start)}`;
  }

  if (sameYear) {
    return `${new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(start)} a ${new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(end)}`;
  }

  return `${formatAgendaDay(start)} a ${formatAgendaDay(end)}`;
}

export function buildAgendaEventsFromVisits(visits: Visit[]): AgendaEvent[] {
  return visits.flatMap((visit) => {
    const baseEvent = {
      source_visit_id: visit.id,
      client_id: visit.client_id,
      client_name: visit.clients?.name ?? 'Cliente sem nome',
      farm_id: visit.farm_id,
      farm_name: visit.farms?.name ?? null,
      status: visit.status,
      visit_type: visit.visit_type,
      purpose: visit.purpose,
    };

    const events: AgendaEvent[] = [
      {
        ...baseEvent,
        id: `${visit.id}:visit`,
        type: 'visit',
        title: 'Visita',
        starts_at: visit.visit_date,
        color_variant: getColorVariant(visit.status),
      },
    ];

    if (visit.next_visit_at) {
      events.push({
        ...baseEvent,
        id: `${visit.id}:next_visit`,
        type: 'next_visit',
        title: 'Próxima visita',
        starts_at: visit.next_visit_at,
        color_variant: 'amber',
      });
    }

    return events;
  });
}

export function getEventsForDay(events: AgendaEvent[], date: Date) {
  return events
    .filter((event) => isSameDay(new Date(event.starts_at), date))
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function getColorVariant(status: VisitStatus): AgendaColorVariant {
  if (status === 'canceled') return 'gray';
  if (status === 'completed' || status === 'scheduled') return 'green';
  return 'gray';
}
