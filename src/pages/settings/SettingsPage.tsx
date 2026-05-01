import { type FormEvent, type ReactNode, useEffect, useState } from 'react';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useResetSettings, useSettings, useUpdateSettings } from '@/hooks/useSettings';
import {
  defaultAgendaViewOptions,
  defaultVisitReportTemplate,
  defaultVisitStatusOptions,
  defaultVisitTypeOptions,
  visitReminderOptions,
} from '@/lib/settings-options';
import { cn } from '@/lib/utils';
import type {
  AgendaViewMode,
  SubscriptionPlan,
  SubscriptionStatus,
  UserSettingsUpdate,
  VisitReminderHoursBefore,
} from '@/types/settings.types';
import type { VisitStatus, VisitType } from '@/types/visit.types';

interface SettingsFormState extends Required<Omit<UserSettingsUpdate, 'whatsapp_visit_template'>> {
  whatsapp_visit_template: string;
}

const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15 disabled:bg-background disabled:text-muted-foreground';

const planLabels: Record<SubscriptionPlan, string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
};

const statusLabels: Record<SubscriptionStatus, string> = {
  trial: 'Teste',
  active: 'Ativa',
  past_due: 'Pagamento pendente',
  canceled: 'Cancelada',
};

const templateVariables = [
  '{client_name}',
  '{visit_date}',
  '{farm_name}',
  '{summary}',
  '{recommendations}',
  '{next_visit_date}',
  '{report_link}',
];

export function SettingsPage() {
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();
  const resetSettings = useResetSettings();
  const [form, setForm] = useState<SettingsFormState | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (settingsQuery.data) {
      setForm({
        visit_reminder_hours_before: settingsQuery.data.visit_reminder_hours_before,
        enable_visit_reminders: settingsQuery.data.enable_visit_reminders,
        enable_overdue_visit_alerts: settingsQuery.data.enable_overdue_visit_alerts,
        enable_daily_summary: settingsQuery.data.enable_daily_summary,
        daily_summary_time: settingsQuery.data.daily_summary_time.slice(0, 5),
        default_visit_status: settingsQuery.data.default_visit_status,
        default_visit_type: settingsQuery.data.default_visit_type,
        default_agenda_view: settingsQuery.data.default_agenda_view,
        whatsapp_visit_template: settingsQuery.data.whatsapp_visit_template ?? defaultVisitReportTemplate,
      });
    }
  }, [settingsQuery.data]);

  if (settingsQuery.isLoading || !form) {
    return <LoadingState />;
  }

  if (settingsQuery.isError) {
    return <ErrorState error={settingsQuery.error} onRetry={() => void settingsQuery.refetch()} />;
  }

  const settings = settingsQuery.data;

  if (!settings) {
    return <ErrorState error={new Error('Configurações não encontradas.')} onRetry={() => void settingsQuery.refetch()} />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    await updateSettings.mutateAsync(form);
    setSuccess('Configurações salvas.');
  };

  const handleReset = async () => {
    const confirmed = window.confirm('Restaurar configurações padrão?');

    if (!confirmed) {
      return;
    }

    setSuccess(null);
    await resetSettings.mutateAsync();
    setSuccess('Configurações restauradas.');
  };

  const restoreTemplate = () => {
    setForm((current) =>
      current
        ? {
            ...current,
            whatsapp_visit_template: defaultVisitReportTemplate,
          }
        : current,
    );
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold leading-tight">Configurações</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Preferências individuais da sua conta no AT CRM.
        </p>
      </section>

      {updateSettings.isError ? <ErrorState error={updateSettings.error} /> : null}
      {resetSettings.isError ? <ErrorState error={resetSettings.error} /> : null}
      {success ? <p className="rounded-2xl border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{success}</p> : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleField
              label="Me lembrar da próxima visita"
              checked={form.enable_visit_reminders}
              onChange={(value) => setForm((current) => current && { ...current, enable_visit_reminders: value })}
            />

            <Field label="Quando avisar?">
              <select
                value={form.visit_reminder_hours_before}
                onChange={(event) =>
                  setForm(
                    (current) =>
                      current && {
                        ...current,
                        visit_reminder_hours_before: Number(event.target.value) as VisitReminderHoursBefore,
                      },
                  )
                }
                className={cn(selectClassName)}
                disabled={!form.enable_visit_reminders}
              >
                {visitReminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <ToggleField
              label="Alertar visitas atrasadas"
              checked={form.enable_overdue_visit_alerts}
              onChange={(value) => setForm((current) => current && { ...current, enable_overdue_visit_alerts: value })}
            />

            <ToggleField
              label="Resumo diário"
              checked={form.enable_daily_summary}
              onChange={(value) => setForm((current) => current && { ...current, enable_daily_summary: value })}
            />

            <Field label="Horário do resumo diário">
              <Input
                type="time"
                value={form.daily_summary_time}
                onChange={(event) =>
                  setForm((current) => current && { ...current, daily_summary_time: event.target.value })
                }
                disabled={!form.enable_daily_summary}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagem do WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Modelo da mensagem de relatório">
              <Textarea
                value={form.whatsapp_visit_template}
                onChange={(event) =>
                  setForm((current) => current && { ...current, whatsapp_visit_template: event.target.value })
                }
                className="min-h-64"
              />
            </Field>

            <div className="rounded-2xl border border-border bg-background p-3">
              <p className="text-sm font-bold">Variáveis disponíveis</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {templateVariables.map((variable) => (
                  <code key={variable} className="rounded-xl border border-border bg-muted px-2 py-1 text-xs">
                    {variable}
                  </code>
                ))}
              </div>
            </div>

            <Button type="button" variant="outline" onClick={restoreTemplate}>
              Restaurar padrão
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Visualização padrão da agenda">
              <select
                value={form.default_agenda_view}
                onChange={(event) =>
                  setForm(
                    (current) =>
                      current && { ...current, default_agenda_view: event.target.value as AgendaViewMode },
                  )
                }
                className={cn(selectClassName)}
              >
                {defaultAgendaViewOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tipo padrão da visita">
              <select
                value={form.default_visit_type}
                onChange={(event) =>
                  setForm((current) => current && { ...current, default_visit_type: event.target.value as VisitType })
                }
                className={cn(selectClassName)}
              >
                {defaultVisitTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status padrão da visita">
              <select
                value={form.default_visit_status}
                onChange={(event) =>
                  setForm(
                    (current) => current && { ...current, default_visit_status: event.target.value as VisitStatus },
                  )
                }
                className={cn(selectClassName)}
              >
                {defaultVisitStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReadonlyValue label="Plano atual" value={planLabels[settings.subscription_plan]} />
            <ReadonlyValue label="Status da assinatura" value={statusLabels[settings.subscription_status]} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? 'Salvando...' : 'Salvar configurações'}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} disabled={resetSettings.isPending}>
            {resetSettings.isPending ? 'Restaurando...' : 'Restaurar padrão'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm transition-colors hover:border-primary/45">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-input accent-primary"
      />
    </label>
  );
}

function ReadonlyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
