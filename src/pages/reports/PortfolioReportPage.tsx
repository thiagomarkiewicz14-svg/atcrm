import { type ReactNode, useMemo, useRef, useState } from 'react';
import { Download, FileDown } from 'lucide-react';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/useClients';
import { useVisits } from '@/hooks/useVisits';
import { formatDate } from '@/lib/formatters';
import { buildPortfolioReport, type PortfolioHealthStatus } from '@/lib/portfolio-insights';
import { cn } from '@/lib/utils';

const periodOptions = [7, 15, 30, 60] as const;

export function PortfolioReportPage() {
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [healthStatus, setHealthStatus] = useState<PortfolioHealthStatus | 'all'>('all');
  const [city, setCity] = useState<string | 'all'>('all');
  const reportRef = useRef<HTMLDivElement | null>(null);
  const clientsQuery = useClients();
  const visitsQuery = useVisits();

  const isLoading = clientsQuery.isLoading || visitsQuery.isLoading;
  const error = clientsQuery.error ?? visitsQuery.error;

  const report = useMemo(
    () =>
      buildPortfolioReport(clientsQuery.data ?? [], visitsQuery.data ?? [], {
        periodDays,
        healthStatus,
        city,
      }),
    [city, clientsQuery.data, healthStatus, periodDays, visitsQuery.data],
  );

  const exportCsv = () => {
    const csv = buildCsv(report.rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `relatorio-carteira-${periodDays}-dias.csv`);
  };

  const exportPdf = async () => {
    if (!reportRef.current) {
      return;
    }

    const { default: html2pdf } = await import('html2pdf.js');
    await html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `relatorio-carteira-${periodDays}-dias.pdf`,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#F8F9F7' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(reportRef.current)
      .save();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          void clientsQuery.refetch();
          void visitsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border-2 border-[#1B4332] bg-[#1B4332] p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4A373]">Relatório de carteira</p>
        <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">Carteira em campo</h1>
        <p className="mt-2 text-sm font-medium text-white/70">
          Visitas, risco e oportunidades por período para decisão operacional.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FilterField label="Período">
          <select
            value={periodDays}
            onChange={(event) => setPeriodDays(Number(event.target.value))}
            className={selectClassName}
          >
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option} dias
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Status">
          <select
            value={healthStatus}
            onChange={(event) => setHealthStatus(event.target.value as PortfolioHealthStatus | 'all')}
            className={selectClassName}
          >
            <option value="all">Todos</option>
            <option value="OK">OK</option>
            <option value="EM RISCO">Em risco</option>
            <option value="CRÍTICO">Crítico</option>
          </select>
        </FilterField>

        <FilterField label="Cidade/região">
          <select value={city} onChange={(event) => setCity(event.target.value)} className={selectClassName}>
            <option value="all">Todas</option>
            {report.cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      <div ref={reportRef} className="space-y-5">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="% carteira ativa" value={`${report.summary.activePortfolioPercent}%`} />
          <SummaryCard label="% sem visita" value={`${report.summary.withoutVisitPercent}%`} tone="risk" />
          <SummaryCard label="clientes críticos" value={report.summary.criticalClients} tone="risk" />
        </section>

        <Card className="border-[#1B4332]/25 bg-[#F3F5F0]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-[#1B4332]">Clientes no período</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button type="button" size="sm" onClick={() => void exportPdf()}>
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.rows.length === 0 ? (
              <p className="rounded-lg border-2 border-dashed border-[#1B4332]/20 bg-background p-4 text-sm font-bold text-[#1B4332]">
                Nenhum cliente encontrado para os filtros atuais.
              </p>
            ) : (
              report.rows.map((row) => <PortfolioRowCard key={row.client.id} row={row} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const selectClassName =
  'h-11 w-full rounded-lg border-2 border-input bg-white px-3 text-sm text-foreground shadow-none outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-ring/20';

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-xl border-2 border-[#1B4332]/20 bg-[#F3F5F0] p-3">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SummaryCard({ label, value, tone = 'field' }: { label: string; value: number | string; tone?: 'field' | 'risk' }) {
  return (
    <Card className={tone === 'risk' ? 'border-[#FECACA] bg-[#FEF2F2]' : 'border-[#1B4332]/25 bg-[#F3F5F0]'}>
      <CardContent className="p-4">
        <p className={tone === 'risk' ? 'text-3xl font-black text-[#C53030]' : 'text-3xl font-black text-[#1B4332]'}>
          {value}
        </p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function PortfolioRowCard({ row }: { row: ReturnType<typeof buildPortfolioReport>['rows'][number] }) {
  return (
    <div className="rounded-lg border-2 border-[#1B4332]/20 bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-1 text-base font-black uppercase tracking-[0.02em] text-[#1B4332]">
            {row.client.name}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {[row.client.city, row.client.state].filter(Boolean).join(' / ') || 'Região não informada'}
          </p>
        </div>
        <span className={cn('rounded-md border px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em]', getStatusClassName(row.healthStatus))}>
          {row.healthStatus}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <ReportMetric label="Última visita" value={formatDate(row.lastVisitAt)} />
        <ReportMetric label="Dias sem visita" value={row.daysWithoutVisit} />
        <ReportMetric label="Visitas no período" value={row.visitsInPeriod} />
        <ReportMetric label="Oportunidades" value={row.openOpportunities} />
        <ReportMetric label="Propostas" value={row.proposalsWithoutReturn} />
        <ReportMetric label="Última interação" value={formatDate(row.lastInteractionAt)} />
      </dl>
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="text-[0.62rem] font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-bold text-[#1B4332]">{value}</dd>
    </div>
  );
}

function getStatusClassName(status: PortfolioHealthStatus) {
  if (status === 'CRÍTICO') {
    return 'border-[#FECACA] bg-[#FEF2F2] text-[#C53030]';
  }

  if (status === 'EM RISCO') {
    return 'border-[#D4A373]/40 bg-[#D4A373]/20 text-[#7C5E3C]';
  }

  return 'border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#2E7D32]';
}

function buildCsv(rows: ReturnType<typeof buildPortfolioReport>['rows']) {
  const header = [
    'Cliente',
    'Última visita',
    'Dias sem visita',
    'Status',
    'Visitas no período',
    'Oportunidades abertas',
    'Propostas sem retorno',
    'Última interação',
  ];
  const lines = rows.map((row) =>
    [
      row.client.name,
      formatDate(row.lastVisitAt),
      String(row.daysWithoutVisit),
      row.healthStatus,
      String(row.visitsInPeriod),
      String(row.openOpportunities),
      String(row.proposalsWithoutReturn),
      formatDate(row.lastInteractionAt),
    ].map(escapeCsv).join(','),
  );

  return [header.map(escapeCsv).join(','), ...lines].join('\n');
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
