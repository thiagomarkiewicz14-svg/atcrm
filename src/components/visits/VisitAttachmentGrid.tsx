import { useEffect, useState } from 'react';
import { File, FileAudio, FileText, FileVideo, ImageIcon, Trash2 } from 'lucide-react';

import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeleteVisitAttachment } from '@/hooks/useVisitAttachments';
import { storageService } from '@/services/storage.service';
import type { VisitAttachment } from '@/types/visit.types';

interface VisitAttachmentGridProps {
  attachments: VisitAttachment[];
}

export function VisitAttachmentGrid({ attachments }: VisitAttachmentGridProps) {
  const deleteAttachment = useDeleteVisitAttachment();
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const paths = attachments.map((attachment) => attachment.storage_path);

    setError(null);

    storageService
      .getSignedUrls(paths)
      .then((urls) => {
        if (isMounted) {
          setSignedUrls(urls);
        }
      })
      .catch((caughtError) => {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível carregar anexos.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attachments]);

  const handleDelete = async (attachment: VisitAttachment) => {
    const confirmed = window.confirm('Remover este anexo?');

    if (!confirmed) {
      return;
    }

    await deleteAttachment.mutateAsync(attachment.id);
  };

  if (attachments.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum anexo enviado.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <ErrorState error={new Error(error)} /> : null}
      {deleteAttachment.isError ? <ErrorState error={deleteAttachment.error} /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {attachments.map((attachment) => {
          const signedUrl = signedUrls[attachment.storage_path];

          return (
            <Card key={attachment.id}>
              <CardContent className="space-y-3 p-3">
                {attachment.file_type === 'image' && signedUrl ? (
                  <img
                    src={signedUrl}
                    alt={attachment.file_name ?? 'Anexo da visita'}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <AttachmentIcon fileType={attachment.file_type} />
                  </div>
                )}

                <div className="space-y-1">
                  <p className="truncate text-sm font-medium">{attachment.file_name ?? 'Arquivo'}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
                </div>

                <div className="flex items-center gap-2">
                  {signedUrl ? (
                    <a href={signedUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary">
                      Abrir
                    </a>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment)}
                    disabled={deleteAttachment.isPending}
                    className="ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AttachmentIcon({ fileType }: { fileType: VisitAttachment['file_type'] }) {
  if (fileType === 'image') return <ImageIcon className="h-8 w-8" />;
  if (fileType === 'video') return <FileVideo className="h-8 w-8" />;
  if (fileType === 'audio') return <FileAudio className="h-8 w-8" />;
  if (fileType === 'document') return <FileText className="h-8 w-8" />;
  return <File className="h-8 w-8" />;
}

function formatFileSize(value?: number | null) {
  if (!value) {
    return '-';
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}
