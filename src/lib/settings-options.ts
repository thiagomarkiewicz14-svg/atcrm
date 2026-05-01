import type { AgendaViewMode, VisitReminderHoursBefore } from '@/types/settings.types';
import type { VisitStatus, VisitType } from '@/types/visit.types';

export const defaultVisitReportTemplate = `Olá {client_name}, segue o relatório da visita realizada em {visit_date} na propriedade {farm_name}.

{summary}

Recomendações:
{recommendations}

Próxima visita: {next_visit_date}

Acesse o relatório completo aqui:
{report_link}
`;

export const visitReminderOptions: Array<{ value: VisitReminderHoursBefore; label: string }> = [
  { value: 1, label: '1 hora antes' },
  { value: 3, label: '3 horas antes' },
  { value: 6, label: '6 horas antes' },
  { value: 12, label: '12 horas antes' },
  { value: 24, label: '24 horas antes' },
  { value: 48, label: '48 horas antes' },
  { value: 72, label: '72 horas antes' },
  { value: 168, label: '7 dias antes' },
];

export const defaultAgendaViewOptions: Array<{ value: AgendaViewMode; label: string }> = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
];

export const dailySummaryOptions: Array<{ value: boolean; label: string }> = [
  { value: true, label: 'Ativado' },
  { value: false, label: 'Desativado' },
];

export const defaultVisitTypeOptions: Array<{ value: VisitType; label: string }> = [
  { value: 'technical', label: 'Técnica' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'post_sale', label: 'Pós-venda' },
  { value: 'prospecting', label: 'Prospecção' },
  { value: 'collection', label: 'Cobrança' },
  { value: 'other', label: 'Outro' },
];

export const defaultVisitStatusOptions: Array<{ value: VisitStatus; label: string }> = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'completed', label: 'Realizada' },
  { value: 'canceled', label: 'Cancelada' },
];
