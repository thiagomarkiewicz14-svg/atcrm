import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { LocateFixed } from 'lucide-react';

import { VisitAttachmentUploader } from '@/components/visits/VisitAttachmentUploader';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useFarmsByClient } from '@/hooks/useFarms';
import { useSettings } from '@/hooks/useSettings';
import { dateTimeLocalToIso, toDateTimeLocalValue } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { visitStatuses, visitTypes } from '@/lib/visit-options';
import type { Visit, VisitInsert, VisitStatus, VisitType } from '@/types/visit.types';

interface VisitFormProps {
  initialValues?: Visit | null;
  defaultClientId?: string | null;
  pendingFiles?: File[];
  onPendingFilesChange?: (files: File[]) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (input: VisitInsert) => Promise<void> | void;
}

interface VisitFormState {
  client_id: string;
  farm_id: string;
  visit_date: string;
  visit_type: VisitType;
  purpose: string;
  summary: string;
  recommendations: string;
  next_visit_at: string;
  status: VisitStatus;
  latitude: string;
  longitude: string;
}

const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15 disabled:bg-background disabled:text-muted-foreground';
const inputClassName = '';

function getInitialState(
  visit?: Visit | null,
  defaultClientId?: string | null,
  defaultVisitType: VisitType = 'technical',
  defaultVisitStatus: VisitStatus = 'completed',
): VisitFormState {
  return {
    client_id: visit?.client_id ?? defaultClientId ?? '',
    farm_id: visit?.farm_id ?? '',
    visit_date: toDateTimeLocalValue(visit?.visit_date ?? new Date().toISOString()),
    visit_type: visit?.visit_type ?? defaultVisitType,
    purpose: visit?.purpose ?? '',
    summary: visit?.summary ?? '',
    recommendations: visit?.recommendations ?? '',
    next_visit_at: toDateTimeLocalValue(visit?.next_visit_at),
    status: visit?.status ?? defaultVisitStatus,
    latitude: visit?.latitude === null || visit?.latitude === undefined ? '' : String(visit.latitude),
    longitude: visit?.longitude === null || visit?.longitude === undefined ? '' : String(visit.longitude),
  };
}

function toNullable(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function toNullableNumber(value: string) {
  const normalized = value.trim();
  return normalized ? Number(normalized.replace(',', '.')) : null;
}

export function VisitForm({
  initialValues,
  defaultClientId,
  pendingFiles = [],
  onPendingFilesChange,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}: VisitFormProps) {
  const { user } = useAuth();
  const settingsQuery = useSettings();
  const initialState = useMemo(
    () =>
      getInitialState(
        initialValues,
        defaultClientId,
        settingsQuery.data?.default_visit_type,
        settingsQuery.data?.default_visit_status,
      ),
    [defaultClientId, initialValues, settingsQuery.data?.default_visit_status, settingsQuery.data?.default_visit_type],
  );
  const [form, setForm] = useState<VisitFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const clientsQuery = useClients();
  const farmsQuery = useFarmsByClient(form.client_id || undefined);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.client_id) {
      setError('Selecione o cliente.');
      return;
    }

    if (!form.visit_date) {
      setError('Informe a data da visita.');
      return;
    }

    if (!form.purpose.trim()) {
      setError('Informe o propósito da visita.');
      return;
    }

    const latitude = toNullableNumber(form.latitude);
    const longitude = toNullableNumber(form.longitude);

    if ((form.latitude && Number.isNaN(latitude)) || (form.longitude && Number.isNaN(longitude))) {
      setError('Latitude e longitude precisam ser números válidos.');
      return;
    }

    await onSubmit({
      client_id: form.client_id,
      farm_id: form.farm_id || null,
      visit_date: dateTimeLocalToIso(form.visit_date) ?? new Date().toISOString(),
      visit_type: form.visit_type,
      purpose: form.purpose.trim(),
      summary: toNullable(form.summary),
      recommendations: toNullable(form.recommendations),
      next_visit_at: dateTimeLocalToIso(form.next_visit_at),
      status: form.status,
      latitude,
      longitude,
    });
  };

  const useCurrentLocation = () => {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não disponível neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
      },
      () => {
        setLocationError('Não foi possível capturar sua localização.');
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  if (clientsQuery.isLoading || settingsQuery.isLoading) {
    return <LoadingState />;
  }

  if (settingsQuery.isError) {
    return <ErrorState error={settingsQuery.error} onRetry={() => void settingsQuery.refetch()} />;
  }

  if (clientsQuery.isError) {
    return <ErrorState error={clientsQuery.error} onRetry={() => void clientsQuery.refetch()} />;
  }

  const clients = clientsQuery.data ?? [];
  const farms = farmsQuery.data ?? [];

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Cliente">
          <select
            value={form.client_id}
            onChange={(event) =>
              setForm((current) => ({ ...current, client_id: event.target.value, farm_id: '' }))
            }
            className={cn(selectClassName)}
            required
          >
            <option value="">Selecione</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Propriedade">
          <select
            value={form.farm_id}
            onChange={(event) => setForm((current) => ({ ...current, farm_id: event.target.value }))}
            className={cn(selectClassName)}
            disabled={!form.client_id || farmsQuery.isLoading}
          >
            <option value="">Sem propriedade vinculada</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Data da visita">
          <Input
            type="datetime-local"
            value={form.visit_date}
            onChange={(event) => setForm((current) => ({ ...current, visit_date: event.target.value }))}
            className={inputClassName}
            required
          />
        </Field>

        <Field label="Tipo da visita">
          <select
            value={form.visit_type}
            onChange={(event) => setForm((current) => ({ ...current, visit_type: event.target.value as VisitType }))}
            className={cn(selectClassName)}
          >
            {visitTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as VisitStatus }))}
            className={cn(selectClassName)}
          >
            {visitStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Próxima visita em">
          <Input
            type="datetime-local"
            value={form.next_visit_at}
            onChange={(event) => setForm((current) => ({ ...current, next_visit_at: event.target.value }))}
            className={inputClassName}
          />
        </Field>

        <Field label="Propósito da visita" className="sm:col-span-2">
          <Input
            value={form.purpose}
            onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))}
            className={inputClassName}
            required
          />
        </Field>

        <Field label="Relato/Resumo" className="sm:col-span-2">
          <Textarea
            value={form.summary}
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            className={inputClassName}
          />
        </Field>

        <Field label="Recomendações" className="sm:col-span-2">
          <Textarea
            value={form.recommendations}
            onChange={(event) => setForm((current) => ({ ...current, recommendations: event.target.value }))}
            className={inputClassName}
          />
        </Field>

        <Field label="Latitude">
          <Input
            value={form.latitude}
            onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))}
            className={inputClassName}
            inputMode="decimal"
          />
        </Field>

        <Field label="Longitude">
          <Input
            value={form.longitude}
            onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))}
            className={inputClassName}
            inputMode="decimal"
          />
        </Field>

        <div className="space-y-2 sm:col-span-2">
          <Button type="button" variant="outline" onClick={useCurrentLocation}>
            <LocateFixed className="h-4 w-4" />
            Usar minha localização
          </Button>
          {locationError ? <p className="text-sm text-destructive">{locationError}</p> : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Anexos</Label>
          <VisitAttachmentUploader
            userId={user?.id}
            visitId={initialValues?.id}
            pendingFiles={pendingFiles}
            onPendingFilesChange={onPendingFilesChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
