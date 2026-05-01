import { type ChangeEvent, useRef, useState } from 'react';
import { FileUp, Trash2 } from 'lucide-react';

import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { useUploadVisitAttachment } from '@/hooks/useUpload';

interface VisitAttachmentUploaderProps {
  userId?: string;
  visitId?: string;
  pendingFiles?: File[];
  onPendingFilesChange?: (files: File[]) => void;
  onUploaded?: () => void;
}

export function VisitAttachmentUploader({
  userId,
  visitId,
  pendingFiles = [],
  onPendingFilesChange,
  onUploaded,
}: VisitAttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadAttachment = useUploadVisitAttachment();
  const [localError, setLocalError] = useState<string | null>(null);
  const canUploadNow = Boolean(userId && visitId);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    setLocalError(null);

    if (files.length === 0) {
      return;
    }

    if (!canUploadNow || !userId || !visitId) {
      onPendingFilesChange?.([...pendingFiles, ...files]);
      return;
    }

    try {
      for (const file of files) {
        await uploadAttachment.mutateAsync({ userId, visitId, file });
      }
      onUploaded?.();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.');
    }
  };

  const removePendingFile = (fileIndex: number) => {
    onPendingFilesChange?.(pendingFiles.filter((_file, index) => index !== fileIndex));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFiles}
      />

      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploadAttachment.isPending}>
        <FileUp className="h-4 w-4" />
        {uploadAttachment.isPending ? 'Enviando...' : 'Anexar arquivo'}
      </Button>

      {localError ? <ErrorState error={new Error(localError)} /> : null}

      {pendingFiles.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-border bg-white p-3 shadow-sm">
          <p className="text-sm font-medium">Arquivos para enviar ao salvar</p>
          {pendingFiles.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-muted-foreground">{file.name}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => removePendingFile(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
