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
      <Card className="w-full max-w-md">
        <CardHeader>
          <Logo variant="full" className="mb-4" />
          <CardTitle className="text-2xl">Recuperar senha</CardTitle>
          <p className="text-sm text-muted-foreground">Informe seu email para receber o link de recuperação.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error ? <p className="rounded-2xl border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
            {success ? <p className="rounded-2xl border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{success}</p> : null}

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
              {isSubmitting ? 'Enviando...' : 'Enviar recuperação'}
            </Button>

            <Link to="/login" className="block text-sm font-semibold text-primary hover:underline">
              Voltar para login
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
