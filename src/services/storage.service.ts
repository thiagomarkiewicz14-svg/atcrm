import { supabase } from './supabase';

const VISIT_ATTACHMENTS_BUCKET = 'visit-attachments';

export interface UploadedVisitAttachmentFile {
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  return sanitized || 'arquivo';
}

export const storageService = {
  async uploadVisitAttachment(userId: string, visitId: string, file: File): Promise<UploadedVisitAttachmentFile> {
    const fileName = sanitizeFileName(file.name);
    const storagePath = `${userId}/visits/${visitId}/${crypto.randomUUID()}-${fileName}`;

    const { error } = await supabase.storage.from(VISIT_ATTACHMENTS_BUCKET).upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

    if (error) {
      throw error;
    }

    return {
      storagePath,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    };
  },

  async removeFile(path: string): Promise<void> {
    const { error } = await supabase.storage.from(VISIT_ATTACHMENTS_BUCKET).remove([path]);

    if (error) {
      throw error;
    }
  },

  async getSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(VISIT_ATTACHMENTS_BUCKET)
      .createSignedUrl(path, 60 * 60);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  },

  async getSignedUrls(paths: string[]): Promise<Record<string, string>> {
    if (paths.length === 0) {
      return {};
    }

    const { data, error } = await supabase.storage
      .from(VISIT_ATTACHMENTS_BUCKET)
      .createSignedUrls(paths, 60 * 60);

    if (error) {
      throw error;
    }

    return data.reduce<Record<string, string>>((accumulator, item) => {
      if (item.path && item.signedUrl) {
        accumulator[item.path] = item.signedUrl;
      }

      return accumulator;
    }, {});
  },
};
