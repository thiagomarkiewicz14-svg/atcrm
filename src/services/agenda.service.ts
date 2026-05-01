import { buildAgendaEventsFromVisits } from '@/lib/agenda';
import type { AgendaEvent, ListAgendaEventsParams } from '@/types/agenda.types';
import type { Visit } from '@/types/visit.types';

import { supabase } from './supabase';

const agendaVisitSelect = `
  *,
  clients:client_id(id,name,city,state),
  farms:farm_id(id,name,city,state)
`;

export const agendaService = {
  async listAgendaEvents(params: ListAgendaEventsParams): Promise<AgendaEvent[]> {
    const { startDate, endDate } = params;

    const { data, error } = await supabase
      .from('visits')
      .select(agendaVisitSelect)
      .is('deleted_at', null)
      .or(
        `and(visit_date.gte.${startDate},visit_date.lte.${endDate}),and(next_visit_at.gte.${startDate},next_visit_at.lte.${endDate})`,
      )
      .returns<Visit[]>();

    if (error) {
      throw error;
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    return buildAgendaEventsFromVisits(data ?? [])
      .filter((event) => {
        const eventTime = new Date(event.starts_at).getTime();
        return eventTime >= startTime && eventTime <= endTime;
      })
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  },
};
