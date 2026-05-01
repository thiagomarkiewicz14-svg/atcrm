import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { useVisitAttachments } from '@/hooks/useVisitAttachments';
import { useVisit } from '@/hooks/useVisits';
import { formatDateTime } from '@/lib/formatters';
import { getVisitStatusLabel, getVisitTypeLabel } from '@/lib/visit-options';
import { storageService } from '@/services/storage.service';
import type { VisitAttachment } from '@/types/visit.types';

export function VisitReportPage() {
  const { id } = useParams();
  const visitQuery = useVisit(id);
  const attachmentsQuery = useVisitAttachments(id);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [signedUrlError, setSignedUrlError] = useState<string | null>(null);
  const [signedUrlsReady, setSignedUrlsReady] = useState(false);

  const attachments = useMemo(() => attachmentsQuery.data ?? [], [attachmentsQuery.data]);

  useEffect(() => {
    let isMounted = true;
    const paths = attachments.map((attachment) => attachment.storage_path);

    setSignedUrlError(null);
    setSignedUrlsReady(false);

    storageService
      .getSignedUrls(paths)
      .then((urls) => {
        if (isMounted) {
          setSignedUrls(urls);
          setSignedUrlsReady(true);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setSignedUrlError(error instanceof Error ? error.message : 'Não foi possível carregar anexos.');
          setSignedUrlsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attachments]);

  if (visitQuery.isLoading || attachmentsQuery.isLoading) {
    return <LoadingState />;
  }

  if (visitQuery.isError || attachmentsQuery.isError) {
    return (
      <ErrorState
        error={visitQuery.error ?? attachmentsQuery.error}
        onRetry={() => {
          void visitQuery.refetch();
          void attachmentsQuery.refetch();
        }}
      />
    );
  }

  const visit = visitQuery.data;

  if (!visit) {
    return <EmptyState title="Relatório não encontrado" action={<Link to="/visits">Voltar para visitas</Link>} />;
  }

  const fileName = buildReportFileName(visit.clients?.name ?? 'cliente', visit.visit_date);

  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <Link to={`/visits/${visit.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Voltar para visita
        </Link>
      </div>

      {signedUrlError ? <ErrorState error={new Error(signedUrlError)} /> : null}

      <article
        id="visit-report-content"
        data-ready={signedUrlsReady ? 'true' : 'false'}
        data-file-name={fileName}
        className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-5 text-slate-950 shadow-field sm:p-8 print:border-0 print:shadow-none"
      >
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Relatório técnico/comercial</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">Relatório de visita</h1>
          <p className="mt-2 text-sm text-slate-600">{formatDateTime(visit.visit_date)}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{getVisitTypeLabel(visit.visit_type)}</Badge>
            <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
              {getVisitStatusLabel(visit.status)}
            </Badge>
          </div>
        </header>

        <section className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-2">
          <ReportField label="Cliente" value={visit.clients?.name ?? '-'} />
          <ReportField label="Propriedade" value={visit.farms?.name ?? '-'} />
          <ReportField label="Propósito" value={visit.purpose} className="sm:col-span-2" />
          {visit.next_visit_at ? (
            <ReportField label="Próxima visita" value={formatDateTime(visit.next_visit_at)} />
          ) : null}
        </section>

        <section className="space-y-5 border-b border-slate-200 py-5">
          <ReportTextBlock title="Resumo da visita" value={visit.summary} fallback="Resumo não informado." />
          <ReportTextBlock
            title="Recomendações"
            value={visit.recommendations}
            fallback="Sem recomendações registradas."
          />
        </section>

        <section className="space-y-4 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Anexos</h2>
            <span className="text-sm text-slate-500">{attachments.length} arquivo{attachments.length === 1 ? '' : 's'}</span>
          </div>

          {attachments.length === 0 ? (
            <p className="text-sm text-slate-600">Nenhum anexo registrado nesta visita.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {attachments.map((attachment) => (
                <ReportAttachment
                  key={attachment.id}
                  attachment={attachment}
                  signedUrl={signedUrls[attachment.storage_path]}
                />
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}

function ReportField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function ReportTextBlock({ title, value, fallback }: { title: string; value: string | null; fallback: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value || fallback}</p>
    </div>
  );
}

function ReportAttachment({ attachment, signedUrl }: { attachment: VisitAttachment; signedUrl?: string }) {
  const fileLabel = attachment.file_name ?? 'Arquivo da visita';

  return (
    <div className="break-inside-avoid rounded-lg border border-slate-200 p-3">
      <p className="mb-2 text-sm font-semibold">{fileLabel}</p>

      {attachment.file_type === 'image' && signedUrl ? (
        <img src={signedUrl} alt={fileLabel} className="max-h-[520px] w-full rounded-md object-contain" />
      ) : null}

      {attachment.file_type === 'video' && signedUrl ? (
        <video src={signedUrl} controls className="w-full rounded-md" />
      ) : null}

      {attachment.file_type === 'audio' && signedUrl ? <audio src={signedUrl} controls className="w-full" /> : null}

      {(attachment.file_type === 'document' || attachment.file_type === 'other' || !signedUrl) ? (
        <a
          href={signedUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <FileText className="h-4 w-4" />
          Abrir documento
        </a>
      ) : null}

      {attachment.caption ? <p className="mt-2 text-sm text-slate-600">{attachment.caption}</p> : null}
    </div>
  );
}

function buildReportFileName(clientName: string, visitDate: string) {
  const normalizedClient = clientName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  const date = new Date(visitDate).toISOString().slice(0, 10);

  return `relatorio-visita-${normalizedClient || 'cliente'}-${date}.pdf`;
}
