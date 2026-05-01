import type { Profile, ProfileUpdate } from '@/types/profile.types';

import { authService } from './auth.service';
import { supabase } from './supabase';

export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .returns<Profile[]>()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateProfile(input: ProfileUpdate): Promise<Profile> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('profiles')
      .update(input)
      .eq('id', userId)
      .select('*')
      .returns<Profile[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};
