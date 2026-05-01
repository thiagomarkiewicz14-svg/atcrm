import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { LocationFields } from '@/components/shared/LocationFields';
import { MultiCheckboxField } from '@/components/shared/MultiCheckboxField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MAIN_CROP_OPTIONS, SEASON_OPTIONS } from '@/lib/agro-options';
import { cn } from '@/lib/utils';
import type { Farm, FarmInsert } from '@/types/farm.types';

interface FarmFormProps {
  clientId: string;
  initialValues?: Farm | null;
  isSubmitting?: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (input: FarmInsert) => Promise<void> | void;
}

const defaultValues: Omit<FarmInsert, 'client_id'> = {
  name: '',
  city: null,
  state: null,
  total_area: null,
  main_crops: [],
  current_season: null,
  notes: null,
};

const inputClassName = '';
const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15';

function toNullable(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function getInitialFormValues(farm?: Farm | null): Omit<FarmInsert, 'client_id'> {
  if (!farm) {
    return defaultValues;
  }

  return {
    name: farm.name,
    city: farm.city,
    state: farm.state,
    total_area: farm.total_area,
    main_crops: farm.main_crops,
    current_season: farm.current_season,
    notes: farm.notes,
  };
}

export function FarmForm({
  clientId,
  initialValues,
  isSubmitting = false,
  submitLabel,
  onCancel,
  onSubmit,
}: FarmFormProps) {
  const initialFormValues = useMemo(() => getInitialFormValues(initialValues), [initialValues]);
  const [form, setForm] = useState(initialFormValues);
  const [totalAreaText, setTotalAreaText] = useState(
    initialFormValues.total_area === null ? '' : String(initialFormValues.total_area),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialFormValues);
    setTotalAreaText(initialFormValues.total_area === null ? '' : String(initialFormValues.total_area));
  }, [initialFormValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Informe o nome da propriedade.');
      return;
    }

    const parsedArea = totalAreaText.trim() ? Number(totalAreaText.replace(',', '.')) : null;

    if (parsedArea !== null && (Number.isNaN(parsedArea) || parsedArea < 0)) {
      setError('Informe uma área total válida.');
      return;
    }

    await onSubmit({
      client_id: clientId,
      name: form.name.trim(),
      city: form.city,
      state: form.state,
      total_area: parsedArea,
      main_crops: form.main_crops,
      current_season: form.current_season,
      notes: toNullable(form.notes ?? ''),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome da propriedade" className="sm:col-span-2">
          <Input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className={inputClassName}
            required
          />
        </Field>

        <LocationFields
          stateValue={form.state}
          cityValue={form.city}
          onStateChange={(value) => setForm((current) => ({ ...current, state: value }))}
          onCityChange={(value) => setForm((current) => ({ ...current, city: value }))}
          className="sm:col-span-2"
        />

        <Field label="Área total">
          <Input
            value={totalAreaText}
            onChange={(event) => setTotalAreaText(event.target.value)}
            className={inputClassName}
            inputMode="decimal"
          />
        </Field>

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

        <MultiCheckboxField
          label="Culturas"
          values={form.main_crops}
          options={MAIN_CROP_OPTIONS}
          onChange={(values) => setForm((current) => ({ ...current, main_crops: values }))}
          className="sm:col-span-2"
        />

        <Field label="Observações" className="sm:col-span-2">
          <Textarea
            value={form.notes ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
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
