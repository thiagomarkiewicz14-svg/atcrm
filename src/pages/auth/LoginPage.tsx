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
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden min-h-screen flex-col justify-between bg-[#1B4332] p-10 text-white lg:flex">
        <Logo variant="full" className="text-white [&_span:last-child_span:last-child]:text-white/65" />

        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">AT CRM</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Gestão inteligente para o agronegócio</h1>
          <p className="mt-5 text-base leading-7 text-white/72">
            Uma central profissional para Assistentes Técnicos, RTVs e consultores acompanharem clientes,
            propriedades e visitas com clareza.
          </p>
        </div>

        <p className="text-sm text-white/55">Tecnologia de campo com base própria e portátil.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo variant="full" />
            <p className="mt-4 text-sm text-muted-foreground">Gestão inteligente para o agronegócio</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground">Entrar</h2>
              <p className="mt-2 text-sm text-muted-foreground">Acesse sua operação técnica e comercial no campo.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error ? (
                <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
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
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Criar conta
                </Link>
                <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
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
