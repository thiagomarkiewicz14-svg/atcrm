import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsService } from '@/services/settings.service';
import type { UserSettingsUpdate } from '@/types/settings.types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getMySettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UserSettingsUpdate) => settingsService.updateMySettings(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.resetMySettingsToDefault,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
