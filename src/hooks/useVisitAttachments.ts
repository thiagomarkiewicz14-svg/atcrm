import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { visitAttachmentsService } from '@/services/visit-attachments.service';
import type { VisitAttachmentInsert } from '@/types/visit.types';

export function useVisitAttachments(visitId?: string) {
  return useQuery({
    queryKey: ['visit-attachments', visitId],
    queryFn: () => {
      if (!visitId) {
        throw new Error('Visita não informada.');
      }

      return visitAttachmentsService.listVisitAttachments(visitId);
    },
    enabled: Boolean(visitId),
  });
}

export function useCreateVisitAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VisitAttachmentInsert) => visitAttachmentsService.createVisitAttachment(input),
    onSuccess: (attachment) => {
      void queryClient.invalidateQueries({ queryKey: ['visit-attachments', attachment.visit_id] });
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useDeleteVisitAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => visitAttachmentsService.deleteVisitAttachment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['visit-attachments'] });
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}
