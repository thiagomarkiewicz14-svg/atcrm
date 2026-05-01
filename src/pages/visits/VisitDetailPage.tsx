import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarClock, Download, Edit, FileText, MessageCircle, Trash2 } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitAttachmentGrid } from '@/components/visits/VisitAttachmentGrid';
import { VisitAttachmentUploader } from '@/components/visits/VisitAttachmentUploader';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useVisitAttachments } from '@/hooks/useVisitAttachments';
import { useDeleteVisit, useVisit } from '@/hooks/useVisits';
import { formatDateTime } from '@/lib/formatters';
import { getVisitStatusLabel, getVisitTypeLabel } from '@/lib/visit-options';
import { buildVisitWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { generateReportLink, generateVisitPdf } from '@/services/report.service';

export function VisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const visitQuery = useVisit(id);
  const attachmentsQuery = useVisitAttachments(id);
  const settingsQuery = useSettings();
  const deleteVisit = useDeleteVisit();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

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
    return <EmptyState title="Visita não encontrada" action={<Link to="/visits">Voltar para visitas</Link>} />;
  }

  const clientWhatsApp = visit.clients?.whatsapp;
  const reportLink = generateReportLink(visit.id);
  const whatsAppLink =
    clientWhatsApp && settingsQuery.data
      ? buildWhatsAppLink(clientWhatsApp, buildVisitWhatsAppMessage(visit, settingsQuery.data, reportLink))
      : null;

  const handleDelete = async () => {
    const confirmed = window.confirm('Excluir esta visita?');

    if (!confirmed) {
      return;
    }

    await deleteVisit.mutateAsync(visit.id);
    navigate('/visits');
  };

  const handleDownloadPdf = async () => {
    setPdfError(null);
    setIsGeneratingPdf(true);

    try {
      await generateVisitPdf(visit.id);
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : 'Não foi possível gerar o PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarClock className="h-4 w-4" />
            {formatDateTime(visit.visit_date)}
          </p>
          <div>
            <h1 className="text-3xl font-semibold leading-tight">{visit.purpose}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {visit.clients?.name ?? 'Cliente não informado'}
              {visit.farms?.name ? ` · ${visit.farms.name}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>{getVisitTypeLabel(visit.visit_type)}</Badge>
            <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
              {getVisitStatusLabel(visit.status)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link to={`/visits/${visit.id}/edit`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
            <Link to={`/visits/${visit.id}/report`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              <FileText className="h-4 w-4" />
              Relatório
            </Link>
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
              <Download className="h-4 w-4" />
              {isGeneratingPdf ? 'Gerando...' : 'Baixar PDF'}
            </Button>
            {whatsAppLink ? (
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar WhatsApp
              </a>
            ) : null}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteVisit.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </section>

      {pdfError ? <ErrorState error={new Error(pdfError)} /> : null}
      {settingsQuery.isError ? <ErrorState error={settingsQuery.error} /> : null}
      {deleteVisit.isError ? <ErrorState error={deleteVisit.error} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Cliente" value={visit.clients?.name ?? '-'} />
          <InfoRow label="Propriedade" value={visit.farms?.name ?? '-'} />
          <InfoRow label="Latitude" value={visit.latitude === null ? '-' : String(visit.latitude)} />
          <InfoRow label="Longitude" value={visit.longitude === null ? '-' : String(visit.longitude)} />
          <InfoRow label="Relato/Resumo" value={visit.summary ?? '-'} multiline />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
            {visit.recommendations ?? 'Nenhuma recomendação registrada.'}
          </p>
        </CardContent>
      </Card>

      {visit.next_visit_at ? (
        <Card className="border-amber-500/35">
          <CardHeader>
            <CardTitle>Próxima visita</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-[#B85E1B]">{formatDateTime(visit.next_visit_at)}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Anexos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VisitAttachmentUploader
            userId={user?.id}
            visitId={visit.id}
            onUploaded={() => void attachmentsQuery.refetch()}
          />
          <VisitAttachmentGrid attachments={attachmentsQuery.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:grid-cols-[11rem_1fr]">
      <dt className="text-sm font-semibold text-muted-foreground">{label}</dt>
      <dd className={multiline ? 'whitespace-pre-wrap text-sm leading-6' : 'text-sm'}>{value}</dd>
    </div>
  );
}
