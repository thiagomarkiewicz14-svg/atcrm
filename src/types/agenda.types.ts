import type { VisitStatus, VisitType } from './visit.types';

export type AgendaEventType = 'visit' | 'next_visit';

export type AgendaViewMode = 'week' | 'month';

export type AgendaColorVariant = 'green' | 'blue' | 'amber' | 'gray';

export interface AgendaEvent {
  id: string;
  source_visit_id: string;
  type: AgendaEventType;
  title: string;
  client_id: string;
  client_name: string;
  farm_id: string | null;
  farm_name: string | null;
  starts_at: string;
  status: VisitStatus;
  visit_type: VisitType;
  purpose: string;
  color_variant: AgendaColorVariant;
}

export interface ListAgendaEventsParams {
  startDate: string;
  endDate: string;
}
