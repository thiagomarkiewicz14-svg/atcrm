import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { farmsService } from '@/services/farms.service';
import type { FarmInsert, FarmUpdate } from '@/types/farm.types';

export function useFarmsByClient(clientId?: string) {
  return useQuery({
    queryKey: ['farms', 'client', clientId],
    queryFn: () => {
      if (!clientId) {
        throw new Error('Cliente não informado.');
      }

      return farmsService.listFarmsByClient(clientId);
    },
    enabled: Boolean(clientId),
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: FarmInsert) => farmsService.createFarm(input),
    onSuccess: (farm) => {
      void queryClient.invalidateQueries({ queryKey: ['farms', 'client', farm.client_id] });
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FarmUpdate }) => farmsService.updateFarm(id, input),
    onSuccess: (farm) => {
      void queryClient.invalidateQueries({ queryKey: ['farms', 'client', farm.client_id] });
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => farmsService.deleteFarm(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
}
