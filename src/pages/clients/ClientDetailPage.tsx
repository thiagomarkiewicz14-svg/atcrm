import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Edit, MessageCircle, Plus, Trash2 } from 'lucide-react';

import { FarmCard } from '@/components/farms/FarmCard';
import { FarmForm } from '@/components/farms/FarmForm';
import { ClientVisitsTimeline } from '@/components/visits/ClientVisitsTimeline';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClient, useDeleteClient } from '@/hooks/useClients';
import { useCreateFarm, useDeleteFarm, useFarmsByClient, useUpdateFarm } from '@/hooks/useFarms';
import { formatDate, formatPhone } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { buildClientIntroMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import type { Client, ClientStatus, CommercialPotential } from '@/types/client.types';
import type { Farm, FarmInsert } from '@/types/farm.types';

type DetailTab = 'data' | 'farms' | 'visits';

const statusLabels: Record<ClientStatus, string> = {
  prospect: 'Prospect',
  active: 'Ativo',
  inactive: 'Inativo',
  lost: 'Perdido',
};

const potentialLabels: Record<CommercialPotential, string> = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
};

export function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clientQuery = useClient(id);
  const deleteClient = useDeleteClient();
  const [activeTab, setActiveTab] = useState<DetailTab>('data');

  if (clientQuery.isLoading) {
    return <LoadingState />;
  }

  if (clientQuery.isError) {
    return <ErrorState error={clientQuery.error} onRetry={() => void clientQuery.refetch()} />;
  }

  const client = clientQuery.data;

  if (!client) {
    return <EmptyState title="Cliente não encontrado" action={<Link to="/clients">Voltar para clientes</Link>} />;
  }

  const whatsappLink = client.whatsapp
    ? buildWhatsAppLink(client.whatsapp, buildClientIntroMessage(client))
    : null;

  const handleDelete = async () => {
    const confirmed = window.confirm('Excluir este cliente da sua carteira?');

    if (!confirmed) {
      return;
    }

    await deleteClient.mutateAsync(client.id);
    navigate('/clients');
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-xl border-2 border-[#1B4332] bg-[#1B4332] p-5 text-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4A373]">Cliente em carteira</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">{client.name}</h1>
          <p className="mt-2 text-sm font-medium text-white/70">
            {[client.city, client.state].filter(Boolean).join(' / ') || 'Localização não informada'}
          </p>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <Badge>{statusLabels[client.status]}</Badge>
          <Badge variant={client.commercial_potential === 'high' ? 'warning' : 'secondary'}>
            Potencial {potentialLabels[client.commercial_potential]}
          </Badge>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className={`${buttonVariants({ variant: 'secondary', size: 'sm' })} border-white bg-white text-[#1B4332] hover:bg-[#D4A373]`}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          ) : null}
          <Link to={`/clients/${client.id}/edit`} className={`${buttonVariants({ variant: 'secondary', size: 'sm' })} border-white bg-white text-[#1B4332] hover:bg-[#D4A373]`}>
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteClient.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </section>

      {deleteClient.isError ? <ErrorState error={deleteClient.error} /> : null}

      <div className="grid grid-cols-3 gap-2 rounded-xl border-2 border-[#1B4332]/20 bg-[#F3F5F0] p-1">
        <TabButton isActive={activeTab === 'data'} onClick={() => setActiveTab('data')}>
          Dados
        </TabButton>
        <TabButton isActive={activeTab === 'farms'} onClick={() => setActiveTab('farms')}>
          Propriedades
        </TabButton>
        <TabButton isActive={activeTab === 'visits'} onClick={() => setActiveTab('visits')}>
          Visitas
        </TabButton>
      </div>

      {activeTab === 'data' ? <ClientDataTab client={client} /> : null}
      {activeTab === 'farms' ? <ClientFarmsTab client={client} /> : null}
      {activeTab === 'visits' ? <ClientVisitsTimeline clientId={client.id} /> : null}
    </div>
  );
}

function ClientDataTab({ client }: { client: Client }) {
  const location = [client.city, client.state].filter(Boolean).join(' / ');

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Dados principais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Documento" value={client.document ?? '-'} />
          <InfoRow label="WhatsApp" value={formatPhone(client.whatsapp)} />
          <InfoRow label="Email" value={client.email ?? '-'} />
          <InfoRow label="Cidade/UF" value={location || '-'} />
          <InfoRow label="Safra atual" value={client.current_season ?? '-'} />
          <InfoRow label="Origem" value={client.origin ?? '-'} />
          <InfoRow label="Criado em" value={formatDate(client.created_at)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perfil agrocomercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TagList label="Culturas principais" values={client.main_crops} />
          <TagList label="Tags" values={client.tags} />
          <InfoRow label="Observações" value={client.notes ?? '-'} multiline />
        </CardContent>
      </Card>
    </div>
  );
}

function ClientFarmsTab({ client }: { client: Client }) {
  const farmsQuery = useFarmsByClient(client.id);
  const createFarm = useCreateFarm();
  const updateFarm = useUpdateFarm();
  const deleteFarm = useDeleteFarm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const startCreate = () => {
    setEditingFarm(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingFarm(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (input: FarmInsert) => {
    if (editingFarm) {
      await updateFarm.mutateAsync({
        id: editingFarm.id,
        input: {
          name: input.name,
          city: input.city,
          state: input.state,
          total_area: input.total_area,
          main_crops: input.main_crops,
          current_season: input.current_season,
          notes: input.notes,
        },
      });
      closeForm();
      return;
    }

    await createFarm.mutateAsync(input);
    closeForm();
  };

  const handleDelete = async (farm: Farm) => {
    const confirmed = window.confirm('Excluir esta propriedade?');

    if (!confirmed) {
      return;
    }

    await deleteFarm.mutateAsync(farm.id);
    await farmsQuery.refetch();
  };

  if (farmsQuery.isLoading) {
    return <LoadingState />;
  }

  if (farmsQuery.isError) {
    return <ErrorState error={farmsQuery.error} onRetry={() => void farmsQuery.refetch()} />;
  }

  const farms = farmsQuery.data ?? [];
  const mutationError = createFarm.error ?? updateFarm.error ?? deleteFarm.error;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-[#1B4332]">Propriedades</h2>
        <Button type="button" size="sm" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          Nova propriedade
        </Button>
      </div>

      {mutationError ? <ErrorState error={mutationError} /> : null}

      {isFormOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingFarm ? 'Editar propriedade' : 'Nova propriedade'}</CardTitle>
          </CardHeader>
          <CardContent>
            <FarmForm
              clientId={client.id}
              initialValues={editingFarm}
              isSubmitting={createFarm.isPending || updateFarm.isPending}
              submitLabel={editingFarm ? 'Salvar alterações' : 'Cadastrar propriedade'}
              onCancel={closeForm}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      ) : null}

      {farms.length === 0 && !isFormOpen ? (
        <EmptyState
          title="Nenhuma propriedade cadastrada"
          description="Cadastre uma ou mais propriedades vinculadas a este cliente."
          action={
            <Button type="button" size="sm" onClick={startCreate}>
              <Plus className="h-4 w-4" />
              Nova propriedade
            </Button>
          }
        />
      ) : null}

      {farms.length > 0 ? (
        <div className="space-y-3">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onEdit={(nextFarm) => {
                setEditingFarm(nextFarm);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              isDeleting={deleteFarm.isPending}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 rounded-lg px-2 text-xs font-black uppercase tracking-[0.06em] text-muted-foreground transition-colors duration-150 sm:text-sm',
        isActive && 'bg-[#1B4332] text-white',
      )}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:grid-cols-[11rem_1fr]">
      <dt className="text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className={multiline ? 'whitespace-pre-wrap text-sm' : 'text-sm'}>{value}</dd>
    </div>
  );
}

function TagList({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant="muted">
              {value}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm">-</p>
      )}
    </div>
  );
}
