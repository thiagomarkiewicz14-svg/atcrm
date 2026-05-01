import type { Client } from '@/types/client.types';
import type { UserSettings } from '@/types/settings.types';
import type { Visit } from '@/types/visit.types';

import { formatDateTime } from './formatters';
import { defaultVisitReportTemplate } from './settings-options';
import { renderTemplate } from './template-engine';

export function normalizeBrazilPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('55')) {
    return digits;
  }

  return `55${digits}`;
}

export function buildWhatsAppLink(phone: string, message?: string) {
  const normalizedPhone = normalizeBrazilPhone(phone);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';

  return `https://wa.me/${normalizedPhone}${encodedMessage}`;
}

export function buildClientIntroMessage(client: Client) {
  return `Olá, ${client.name}. Tudo bem? Passando para dar continuidade ao atendimento.`;
}

export function buildVisitWhatsAppMessage(visit: Visit, settings: UserSettings, reportLink: string) {
  const template = settings.whatsapp_visit_template?.trim() || defaultVisitReportTemplate;

  return renderTemplate(template, {
    client_name: visit.clients?.name ?? 'cliente',
    visit_date: formatDateTime(visit.visit_date),
    farm_name: visit.farms?.name ?? 'propriedade não informada',
    summary: visit.summary ?? 'Resumo não informado.',
    recommendations: visit.recommendations ?? 'Sem recomendações registradas.',
    next_visit_date: visit.next_visit_at ? formatDateTime(visit.next_visit_at) : 'Não agendada',
    report_link: reportLink,
  });
}
