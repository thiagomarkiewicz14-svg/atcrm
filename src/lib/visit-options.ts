import type { VisitAttachmentType, VisitStatus, VisitType } from '@/types/visit.types';

export const visitTypes: Array<{ value: VisitType; label: string }> = [
  { value: 'technical', label: 'Técnica' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'post_sale', label: 'Pós-venda' },
  { value: 'prospecting', label: 'Prospecção' },
  { value: 'collection', label: 'Cobrança' },
  { value: 'other', label: 'Outro' },
];

export const visitStatuses: Array<{ value: VisitStatus; label: string }> = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'completed', label: 'Realizada' },
  { value: 'canceled', label: 'Cancelada' },
];

export const attachmentTypes: VisitAttachmentType[] = ['image', 'video', 'audio', 'document', 'other'];

export function getVisitTypeLabel(value: VisitType) {
  return visitTypes.find((type) => type.value === value)?.label ?? value;
}

export function getVisitStatusLabel(value: VisitStatus) {
  return visitStatuses.find((status) => status.value === value)?.label ?? value;
}

export function getAttachmentTypeFromMime(mimeType: string): VisitAttachmentType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';

  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType.startsWith('text/')
  ) {
    return 'document';
  }

  return 'other';
}
