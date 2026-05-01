import type { Farm, FarmInsert, FarmUpdate } from '@/types/farm.types';

import { authService } from './auth.service';
import { supabase } from './supabase';

type FarmDatabaseInsert = FarmInsert & {
  user_id: string;
};

function normalizeNullableText(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeInput(input: FarmInsert): FarmInsert {
  return {
    ...input,
    name: input.name.trim(),
    city: normalizeNullableText(input.city),
    state: normalizeNullableText(input.state)?.toUpperCase() ?? null,
    total_area: input.total_area ?? null,
    main_crops: input.main_crops.map((crop) => crop.trim()).filter(Boolean),
    current_season: normalizeNullableText(input.current_season),
    notes: normalizeNullableText(input.notes),
  };
}

function normalizeUpdate(input: FarmUpdate): FarmUpdate {
  const nextInput = { ...input };

  if (typeof nextInput.name === 'string') nextInput.name = nextInput.name.trim();
  if ('city' in nextInput) nextInput.city = normalizeNullableText(nextInput.city ?? null);
  if ('state' in nextInput) nextInput.state = normalizeNullableText(nextInput.state ?? null)?.toUpperCase() ?? null;
  if ('total_area' in nextInput) nextInput.total_area = nextInput.total_area ?? null;
  if ('current_season' in nextInput) nextInput.current_season = normalizeNullableText(nextInput.current_season ?? null);
  if ('notes' in nextInput) nextInput.notes = normalizeNullableText(nextInput.notes ?? null);
  if ('main_crops' in nextInput && nextInput.main_crops) {
    nextInput.main_crops = nextInput.main_crops.map((crop) => crop.trim()).filter(Boolean);
  }

  return nextInput;
}

export const farmsService = {
  async listFarmsByClient(clientId: string): Promise<Farm[]> {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('client_id', clientId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<Farm[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async getFarmById(id: string): Promise<Farm | null> {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .returns<Farm[]>()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async createFarm(input: FarmInsert): Promise<Farm> {
    const userId = await authService.requireUserId();
    const row: FarmDatabaseInsert = {
      ...normalizeInput(input),
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('farms')
      .insert(row)
      .select('*')
      .returns<Farm[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateFarm(id: string, input: FarmUpdate): Promise<Farm> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('farms')
      .update(normalizeUpdate(input))
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('*')
      .returns<Farm[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteFarm(id: string): Promise<void> {
    const userId = await authService.requireUserId();

    const { error } = await supabase
      .from('farms')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  },
};
