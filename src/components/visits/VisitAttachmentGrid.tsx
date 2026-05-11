import { useEffect, useState } from 'react';
import { File, FileAudio, FileText, FileVideo, ImageIcon, Trash2 } from 'lucide-react';

import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDeleteVisitAttachment, useTranscribeVisitAudio } from '@/hooks/useVisitAttachments';
import { storageService } from '@/services/storage.service';
import type { VisitAttachment } from '@/types/visit.types';

interface VisitAttachmentGridProps {
  attachments: VisitAttachment[];
}

export function VisitAttachmentGrid({ attachments }: VisitAttachmentGridProps) {
  const deleteAttachment = useDeleteVisitAttachment();
  const transcribeAudio = useTranscribeVisitAudio();
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [transcribingAttachmentId, setTranscribingAttachmentId] = useState<string | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

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

  const handleTranscribe = async (attachment: VisitAttachment) => {
    setTranscriptionError(null);
    setTranscribingAttachmentId(attachment.id);

    try {
      await transcribeAudio.mutateAsync(attachment.id);
    } catch (caughtError) {
      setTranscriptionError(
        caughtError instanceof Error ? caughtError.message : 'Nao foi possivel transcrever o audio.',
      );
    } finally {
      setTranscribingAttachmentId(null);
    }
  };

  if (attachments.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum anexo enviado.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <ErrorState error={new Error(error)} /> : null}
      {deleteAttachment.isError ? <ErrorState error={deleteAttachment.error} /> : null}
      {transcriptionError ? <ErrorState error={new Error(transcriptionError)} /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {attachments.map((attachment) => {
          const signedUrl = signedUrls[attachment.storage_path];
          const isAudio = attachment.file_type === 'audio';
          const isTranscribing =
            attachment.transcript_status === 'processing' || transcribingAttachmentId === attachment.id;
          const hasCompletedTranscript =
            attachment.transcript_status === 'completed' && Boolean(attachment.transcript_text?.trim());

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

                {isAudio && signedUrl ? (
                  <audio src={signedUrl} controls className="w-full" />
                ) : null}

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
                  {isAudio && !hasCompletedTranscript ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTranscribe(attachment)}
                      disabled={isTranscribing || transcribeAudio.isPending}
                    >
                      {isTranscribing ? 'Transcrevendo...' : 'Transcrever audio'}
                    </Button>
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

                {isAudio ? <AudioTranscript attachment={attachment} /> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AudioTranscript({ attachment }: { attachment: VisitAttachment }) {
  if (attachment.transcript_status === 'processing') {
    return (
      <p className="rounded-lg border border-[#C8A951]/40 bg-[#C8A951]/15 p-3 text-sm font-medium text-[#1E3A2F]">
        Transcrevendo audio...
      </p>
    );
  }

  if (attachment.transcript_status === 'failed') {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-destructive">Falha na transcricao</p>
        <p className="mt-1 text-sm text-destructive">
          {attachment.transcript_error ?? 'Nao foi possivel transcrever este audio.'}
        </p>
      </div>
    );
  }

  if (attachment.transcript_status === 'completed' && attachment.transcript_text) {
    return (
      <div className="rounded-lg border border-[#1E3A2F]/20 bg-background p-3">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#1E3A2F]">Transcricao</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {attachment.transcript_text}
        </p>
      </div>
    );
  }

  return null;
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
