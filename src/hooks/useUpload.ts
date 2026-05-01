import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAttachmentTypeFromMime } from '@/lib/visit-options';
import { storageService } from '@/services/storage.service';
import { visitAttachmentsService } from '@/services/visit-attachments.service';
import type { VisitAttachment } from '@/types/visit.types';

interface UploadVisitAttachmentInput {
  userId: string;
  visitId: string;
  file: File;
  caption?: string | null;
}

export function useUploadVisitAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, visitId, file, caption = null }: UploadVisitAttachmentInput): Promise<VisitAttachment> => {
      const uploadedFile = await storageService.uploadVisitAttachment(userId, visitId, file);

      return visitAttachmentsService.createVisitAttachment({
        visit_id: visitId,
        file_type: getAttachmentTypeFromMime(uploadedFile.mimeType),
        storage_path: uploadedFile.storagePath,
        file_name: uploadedFile.fileName,
        mime_type: uploadedFile.mimeType,
        file_size: uploadedFile.fileSize,
        caption,
      });
    },
    onSuccess: (attachment) => {
      void queryClient.invalidateQueries({ queryKey: ['visit-attachments', attachment.visit_id] });
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}
