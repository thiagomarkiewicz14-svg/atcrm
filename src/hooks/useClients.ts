import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientsService } from '@/services/clients.service';
import type { ClientFilters, ClientInsert, ClientUpdate } from '@/types/client.types';

export function useClients(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsService.listClients(filters),
  });
}

export function useClient(id?: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Cliente não informado.');
      }

      return clientsService.getClientById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClientInsert) => clientsService.createClient(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] });
      void queryClient.invalidateQueries({ queryKey: ['client-stats'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClientUpdate }) =>
      clientsService.updateClient(id, input),
    onSuccess: (client) => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] });
      void queryClient.invalidateQueries({ queryKey: ['clients', client.id] });
      void queryClient.invalidateQueries({ queryKey: ['client-stats'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['clients'] });
      void queryClient.invalidateQueries({ queryKey: ['client-stats'] });
    },
  });
}

export function useClientStats() {
  return useQuery({
    queryKey: ['client-stats'],
    queryFn: clientsService.getClientStats,
  });
}
