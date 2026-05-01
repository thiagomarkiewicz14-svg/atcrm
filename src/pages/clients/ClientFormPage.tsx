import { useNavigate, useParams } from 'react-router-dom';

import { ClientForm } from '@/components/clients/ClientForm';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClients';
import type { ClientInsert } from '@/types/client.types';

export function ClientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const clientQuery = useClient(id);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  if (isEditing && clientQuery.isLoading) {
    return <LoadingState />;
  }

  if (isEditing && clientQuery.isError) {
    return <ErrorState error={clientQuery.error} onRetry={() => void clientQuery.refetch()} />;
  }

  if (isEditing && !clientQuery.data) {
    return <EmptyState title="Cliente não encontrado" />;
  }

  const handleSubmit = async (input: ClientInsert) => {
    if (isEditing && id) {
      const client = await updateClient.mutateAsync({ id, input });
      navigate(`/clients/${client.id}`);
      return;
    }

    const client = await createClient.mutateAsync(input);
    navigate(`/clients/${client.id}`);
  };

  const mutationError = createClient.error ?? updateClient.error;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold leading-tight">{isEditing ? 'Editar cliente' : 'Novo cliente'}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEditing ? 'Atualize os dados da carteira.' : 'Cadastre um cliente na sua base pessoal.'}
        </p>
      </section>

      {mutationError ? <ErrorState error={mutationError} /> : null}

      <Card>
        <CardContent className="p-4 sm:p-5">
          <ClientForm
            initialValues={clientQuery.data}
            isSubmitting={createClient.isPending || updateClient.isPending}
            submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar cliente'}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
