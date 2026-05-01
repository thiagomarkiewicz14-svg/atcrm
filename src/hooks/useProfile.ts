import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileService } from '@/services/profile.service';
import type { ProfileUpdate } from '@/types/profile.types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getCurrentProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileUpdate) => profileService.updateProfile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
