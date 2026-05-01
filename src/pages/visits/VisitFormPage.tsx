import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import { VisitForm } from '@/components/visits/VisitForm';
import { useAuth } from '@/hooks/useAuth';
import { useCreateVisit, useUpdateVisit, useVisit } from '@/hooks/useVisits';
import { useUploadVisitAttachment } from '@/hooks/useUpload';
import type { VisitInsert } from '@/types/visit.types';

export function VisitFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const defaultClientId = searchParams.get('clientId');
  const visitQuery = useVisit(id);
  const createVisit = useCreateVisit();
  const updateVisit = useUpdateVisit();
  const uploadVisitAttachment = useUploadVisitAttachment();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  if (isEditing && visitQuery.isLoading) {
    return <LoadingState />;
  }

  if (isEditing && visitQuery.isError) {
    return <ErrorState error={visitQuery.error} onRetry={() => void visitQuery.refetch()} />;
  }

  if (isEditing && !visitQuery.data) {
    return <EmptyState title="Visita não encontrada" />;
  }

  const handleSubmit = async (input: VisitInsert) => {
    if (isEditing && id) {
      const visit = await updateVisit.mutateAsync({ id, input });
      navigate(`/visits/${visit.id}`);
      return;
    }

    if (!user) {
      throw new Error('Usuário não autenticado.');
    }

    const visit = await createVisit.mutateAsync(input);

    for (const file of pendingFiles) {
      await uploadVisitAttachment.mutateAsync({ userId: user.id, visitId: visit.id, file });
    }

    navigate(`/visits/${visit.id}`);
  };

  const mutationError = createVisit.error ?? updateVisit.error ?? uploadVisitAttachment.error;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold leading-tight">{isEditing ? 'Editar visita' : 'Nova visita'}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Registre o atendimento de campo e deixe o próximo passo agendado.
        </p>
      </section>

      {mutationError ? <ErrorState error={mutationError} /> : null}

      <Card>
        <CardContent className="p-4 sm:p-5">
          <VisitForm
            initialValues={visitQuery.data}
            defaultClientId={defaultClientId}
            pendingFiles={pendingFiles}
            onPendingFilesChange={setPendingFiles}
            isSubmitting={createVisit.isPending || updateVisit.isPending || uploadVisitAttachment.isPending}
            submitLabel={isEditing ? 'Salvar alterações' : 'Salvar visita'}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
