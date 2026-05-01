import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Save, Settings } from 'lucide-react';

import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { LocationFields } from '@/components/shared/LocationFields';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import type { ProfileUpdate } from '@/types/profile.types';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<ProfileUpdate>({
    full_name: '',
    phone: '',
    company_name: '',
    role: '',
    city: '',
    state: '',
  });
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (profileQuery.data) {
      setForm({
        full_name: profileQuery.data.full_name ?? '',
        phone: profileQuery.data.phone ?? '',
        company_name: profileQuery.data.company_name ?? '',
        role: profileQuery.data.role ?? '',
        city: profileQuery.data.city ?? '',
        state: profileQuery.data.state ?? '',
      });
    }
  }, [profileQuery.data]);

  if (profileQuery.isLoading) {
    return <LoadingState />;
  }

  if (profileQuery.isError) {
    return <ErrorState error={profileQuery.error} onRetry={() => void profileQuery.refetch()} />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    await updateProfile.mutateAsync({
      full_name: normalizeText(form.full_name),
      phone: normalizeText(form.phone),
      company_name: normalizeText(form.company_name),
      role: normalizeText(form.role),
      city: normalizeText(form.city),
      state: normalizeText(form.state)?.toUpperCase() ?? null,
    });
    setSuccess('Perfil atualizado.');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Perfil</h1>
          <p className="mt-2 truncate text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Link to="/settings" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <Settings className="h-4 w-4" />
          Configurações
        </Link>
      </section>

      {updateProfile.isError ? <ErrorState error={updateProfile.error} /> : null}
      {success ? <p className="rounded-2xl border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{success}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Dados do profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <ProfileField label="Nome completo">
              <Input
                value={form.full_name ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              />
            </ProfileField>

            <ProfileField label="WhatsApp profissional">
              <Input
                value={form.phone ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                inputMode="tel"
              />
            </ProfileField>

            <ProfileField label="Empresa">
              <Input
                value={form.company_name ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, company_name: event.target.value }))}
              />
            </ProfileField>

            <ProfileField label="Cargo">
              <Input
                value={form.role ?? ''}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              />
            </ProfileField>

            <LocationFields
              stateValue={form.state ?? null}
              cityValue={form.city ?? null}
              onStateChange={(value) => setForm((current) => ({ ...current, state: value }))}
              onCityChange={(value) => setForm((current) => ({ ...current, city: value }))}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={updateProfile.isPending}>
                <Save className="h-4 w-4" />
                {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function normalizeText(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}
