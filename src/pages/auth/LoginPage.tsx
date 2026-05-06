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
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#1E3A2F] p-10 text-white lg:block">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,.38)_1px,transparent_1px)] [background-size:26px_26px]" />
        <div className="relative flex h-full flex-col justify-between">
          <Logo variant="full" className="text-white [&_span:first-child]:border-white/20 [&_span:first-child]:bg-white/10 [&_span:last-child_span:last-child]:text-white/65" />

          <div className="max-w-lg">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8A951]">Instrumento de campo</p>
            <h1 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-[0.04em]">ATC CRM</h1>
            <p className="mt-5 max-w-md text-lg font-semibold leading-7 text-white/80">
              Prioridade, rota, visita e recuperação de carteira para RTVs e consultores no agro.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {['Carteira', 'Rota', 'Alertas'].map((item) => (
                <div key={item} className="rounded-lg border-2 border-white/20 bg-white/10 p-3">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-white/60">{item}</p>
                  <p className="mt-2 h-1.5 rounded-full bg-[#C8A951]" />
                </div>
              ))}
            </div>
          </div>

          <p className="max-w-sm text-xs font-black uppercase tracking-[0.16em] text-white/50">
            Base própria. Decisão rápida. Ação no campo.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-6 rounded-xl border-2 border-[#1E3A2F] bg-[#1E3A2F] p-4 text-white lg:hidden">
            <Logo variant="full" className="text-white [&_span:first-child]:border-white/20 [&_span:first-child]:bg-white/10 [&_span:last-child_span:last-child]:text-white/65" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">Instrumento de campo</p>
          </div>

          <div className="overflow-hidden rounded-xl border-2 border-[#1E3A2F] bg-[#F8F9F7]">
            <div className="border-b-2 border-[#1E3A2F] bg-[#1E3A2F] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">Acesso operador</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.04em]">Entrar em campo</h2>
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
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
