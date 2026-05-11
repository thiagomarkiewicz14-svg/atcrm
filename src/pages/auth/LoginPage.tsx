import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.signIn({ email, password });
      navigate('/', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#F8F9F7] lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-[#C8A951]/30 bg-[#1E3A2F] p-10 text-white lg:block">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(248,249,247,.38)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border border-[#C8A951]/20" />
        <div className="relative flex h-full flex-col justify-between">
          <Logo variant="full" />

          <div className="max-w-lg">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#C8A951]">Instrumento de campo</p>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-[0.04em]">Operação sob controle</h1>
            <p className="mt-5 max-w-md text-lg font-semibold leading-7 text-white/80">
              Carteira própria, alertas de campo e prioridade comercial para Assistentes Técnicos, RTVs e consultores do agro.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {['Carteira ativa', 'Rota crítica', 'Follow-up'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(248,249,247,0.08)]">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.13em] text-white/60">{item}</p>
                  <p className="mt-3 h-1 rounded-full bg-[#C8A951]" />
                </div>
              ))}
            </div>
          </div>

          <p className="max-w-sm text-xs font-black uppercase tracking-[0.18em] text-white/50">
            Base portátil. Decisão rápida. Execução no campo.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(30,58,47,.05)_1px,transparent_1px),linear-gradient(180deg,rgba(30,58,47,.035)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative w-full max-w-md">
          <div className="mb-6 rounded-2xl border border-[#1E3A2F] bg-[#1E3A2F] p-4 text-white shadow-[0_12px_32px_rgba(30,58,47,0.16)] lg:hidden">
            <Logo variant="full" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">Instrumento de campo</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#1E3A2F] bg-[#F8F9F7] shadow-[0_18px_48px_rgba(30,58,47,0.12)]">
            <div className="border-b border-[#1E3A2F] bg-[#1E3A2F] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C8A951]">Acesso operador</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.04em]">Entrar em campo</h2>
              <p className="mt-2 text-sm font-medium text-white/60">Abra sua carteira e priorize a próxima ação.</p>
            </div>

            <form className="space-y-5 p-5 sm:p-6" onSubmit={handleSubmit}>
              {error ? (
                <p className="rounded-lg border-2 border-destructive bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar agora'}
              </Button>

              <div className="flex flex-col gap-2 border-t-2 border-[#1E3A2F]/20 pt-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
                <Link to="/signup" className="font-black uppercase tracking-[0.08em] text-primary hover:underline">
                  Criar conta
                </Link>
                <Link to="/forgot-password" className="font-black uppercase tracking-[0.08em] text-primary hover:underline">
                  Recuperar senha
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
