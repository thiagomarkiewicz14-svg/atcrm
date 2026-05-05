import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await authService.sendPasswordReset(email);
      setSuccess('Enviamos o link de recuperação para o email informado.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível enviar a recuperação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden border-[#1B4332] bg-[#F3F5F0]">
        <CardHeader className="border-b-2 border-[#1B4332] bg-[#1B4332] text-white">
          <Logo variant="full" className="mb-4 text-white [&_span:first-child]:border-white/20 [&_span:first-child]:bg-white/10 [&_span:last-child_span:last-child]:text-white/65" />
          <CardTitle className="text-2xl">Recuperar acesso</CardTitle>
          <p className="text-sm font-medium text-white/70">Informe seu email para voltar à operação.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded-lg border-2 border-destructive bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="rounded-lg border-2 border-primary bg-primary/10 p-3 text-sm font-semibold text-primary">{success}</p>
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Recuperar acesso'}
            </Button>

            <Link to="/login" className="block border-t-2 border-[#1B4332]/20 pt-4 text-sm font-black uppercase tracking-[0.08em] text-primary hover:underline">
              Voltar para login
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
