import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { visitsService } from '@/services/visits.service';
import type { VisitFilters, VisitInsert, VisitUpdate } from '@/types/visit.types';

export function useVisits(filters: VisitFilters = {}) {
  return useQuery({
    queryKey: ['visits', filters],
    queryFn: () => visitsService.listVisits(filters),
  });
}

export function useVisitsByClient(clientId?: string) {
  return useQuery({
    queryKey: ['visits', 'client', clientId],
    queryFn: () => {
      if (!clientId) {
        throw new Error('Cliente não informado.');
      }

      return visitsService.listVisitsByClient(clientId);
    },
    enabled: Boolean(clientId),
  });
}

export function useVisit(id?: string) {
  return useQuery({
    queryKey: ['visits', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Visita não informada.');
      }

      return visitsService.getVisitById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VisitInsert) => visitsService.createVisit(input),
    onSuccess: (visit) => {
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      void queryClient.invalidateQueries({ queryKey: ['visits', 'client', visit.client_id] });
    },
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: VisitUpdate }) => visitsService.updateVisit(id, input),
    onSuccess: (visit) => {
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
      void queryClient.invalidateQueries({ queryKey: ['visits', visit.id] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      void queryClient.invalidateQueries({ queryKey: ['visits', 'client', visit.client_id] });
    },
  });
}

export function useDeleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => visitsService.deleteVisit(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['visits'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useUpcomingVisits() {
  return useQuery({
    queryKey: ['visits', 'upcoming'],
    queryFn: visitsService.getUpcomingVisits,
  });
}

export function useVisitStats() {
  return useQuery({
    queryKey: ['visits', 'stats'],
    queryFn: visitsService.getVisitStats,
  });
}
