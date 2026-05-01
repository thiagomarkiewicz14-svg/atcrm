import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { LocationFields } from '@/components/shared/LocationFields';
import { MultiCheckboxField } from '@/components/shared/MultiCheckboxField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MAIN_CROP_OPTIONS, SEASON_OPTIONS } from '@/lib/agro-options';
import { cn } from '@/lib/utils';
import type { Client, ClientInsert, ClientStatus, CommercialPotential } from '@/types/client.types';

interface ClientFormProps {
  initialValues?: Client | null;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (input: ClientInsert) => Promise<void> | void;
}

type TextField = 'name' | 'document' | 'whatsapp' | 'email' | 'origin' | 'notes';

const defaultValues: ClientInsert = {
  name: '',
  document: null,
  phone: null,
  whatsapp: null,
  email: null,
  city: null,
  state: null,
  farm_name: null,
  total_area: null,
  main_crops: [],
  current_season: null,
  status: 'prospect',
  commercial_potential: 'medium',
  origin: null,
  tags: [],
  notes: null,
};

const inputClassName = '';
const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15';

function toNullable(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function parseTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitialFormValues(client?: Client | null): ClientInsert {
  if (!client) {
    return defaultValues;
  }

  return {
    name: client.name,
    document: client.document,
    phone: client.phone,
    whatsapp: client.whatsapp,
    email: client.email,
    city: client.city,
    state: client.state,
    farm_name: client.farm_name,
    total_area: client.total_area,
    main_crops: client.main_crops,
    current_season: client.current_season,
    status: client.status,
    commercial_potential: client.commercial_potential,
    origin: client.origin,
    tags: client.tags,
    notes: client.notes,
  };
}

export function ClientForm({ initialValues, isSubmitting = false, submitLabel, onSubmit }: ClientFormProps) {
  const initialFormValues = useMemo(() => getInitialFormValues(initialValues), [initialValues]);
  const [form, setForm] = useState<ClientInsert>(initialFormValues);
  const [tagsText, setTagsText] = useState(initialFormValues.tags.join(', '));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialFormValues);
    setTagsText(initialFormValues.tags.join(', '));
  }, [initialFormValues]);

  const setTextField = (field: TextField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Informe o nome do cliente.');
      return;
    }

    await onSubmit({
      ...form,
      name: form.name.trim(),
      document: toNullable(form.document ?? ''),
      whatsapp: toNullable(form.whatsapp ?? ''),
      email: toNullable(form.email ?? ''),
      city: form.city,
      state: form.state,
      current_season: form.current_season,
      main_crops: form.main_crops,
      origin: toNullable(form.origin ?? ''),
      tags: parseTags(tagsText),
      notes: toNullable(form.notes ?? ''),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome">
          <Input
            value={form.name}
            onChange={(event) => setTextField('name', event.target.value)}
            className={inputClassName}
            required
          />
        </Field>

        <Field label="Documento">
          <Input
            value={form.document ?? ''}
            onChange={(event) => setTextField('document', event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="WhatsApp">
          <Input
            value={form.whatsapp ?? ''}
            onChange={(event) => setTextField('whatsapp', event.target.value)}
            className={inputClassName}
            inputMode="tel"
          />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            value={form.email ?? ''}
            onChange={(event) => setTextField('email', event.target.value)}
            className={inputClassName}
          />
        </Field>

        <LocationFields
          stateValue={form.state}
          cityValue={form.city}
          onStateChange={(value) => setForm((current) => ({ ...current, state: value }))}
          onCityChange={(value) => setForm((current) => ({ ...current, city: value }))}
          className="sm:col-span-2"
        />

        <Field label="Safra atual">
          <select
            value={form.current_season ?? ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, current_season: event.target.value || null }))
            }
            className={cn(selectClassName)}
          >
            <option value="">Selecione</option>
            {form.current_season && !SEASON_OPTIONS.some((season) => season === form.current_season) ? (
              <option value={form.current_season}>{form.current_season}</option>
            ) : null}
            {SEASON_OPTIONS.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as ClientStatus }))
            }
            className={cn(selectClassName)}
          >
            <option value="prospect">Prospect</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="lost">Perdido</option>
          </select>
        </Field>

        <Field label="Potencial comercial">
          <select
            value={form.commercial_potential}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                commercial_potential: event.target.value as CommercialPotential,
              }))
            }
            className={cn(selectClassName)}
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
          </select>
        </Field>

        <Field label="Origem">
          <Input
            value={form.origin ?? ''}
            onChange={(event) => setTextField('origin', event.target.value)}
            className={inputClassName}
          />
        </Field>

        <MultiCheckboxField
          label="Culturas principais"
          values={form.main_crops}
          options={MAIN_CROP_OPTIONS}
          onChange={(values) => setForm((current) => ({ ...current, main_crops: values }))}
          className="sm:col-span-2"
        />

        <Field label="Tags" className="sm:col-span-2">
          <Input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            className={inputClassName}
            placeholder="prioridade, irrigado, indicação"
          />
        </Field>

        <Field label="Observações" className="sm:col-span-2">
          <Textarea
            value={form.notes ?? ''}
            onChange={(event) => setTextField('notes', event.target.value)}
            className={inputClassName}
          />
        </Field>
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
