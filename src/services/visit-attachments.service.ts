import type { VisitAttachment, VisitAttachmentInsert } from '@/types/visit.types';

import { authService } from './auth.service';
import { storageService } from './storage.service';
import { supabase } from './supabase';

type VisitAttachmentDatabaseInsert = VisitAttachmentInsert & {
  user_id: string;
};

function normalizeNullableText(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export const visitAttachmentsService = {
  async listVisitAttachments(visitId: string): Promise<VisitAttachment[]> {
    const { data, error } = await supabase
      .from('visit_attachments')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: false })
      .returns<VisitAttachment[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async createVisitAttachment(input: VisitAttachmentInsert): Promise<VisitAttachment> {
    const userId = await authService.requireUserId();
    const row: VisitAttachmentDatabaseInsert = {
      ...input,
      user_id: userId,
      file_name: normalizeNullableText(input.file_name),
      mime_type: normalizeNullableText(input.mime_type),
      caption: normalizeNullableText(input.caption),
    };

    const { data, error } = await supabase
      .from('visit_attachments')
      .insert(row)
      .select('*')
      .returns<VisitAttachment[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteVisitAttachment(id: string): Promise<void> {
    const { data, error: loadError } = await supabase
      .from('visit_attachments')
      .select('*')
      .eq('id', id)
      .returns<VisitAttachment[]>()
      .single();

    if (loadError) {
      throw loadError;
    }

    const { error } = await supabase.from('visit_attachments').delete().eq('id', id);

    if (error) {
      throw error;
    }

    await storageService.removeFile(data.storage_path);
  },
};
