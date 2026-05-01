import type {
  Client,
  ClientFilters,
  ClientInsert,
  ClientStats,
  ClientUpdate,
} from '@/types/client.types';

import { authService } from './auth.service';
import { supabase } from './supabase';

type ClientDatabaseInsert = ClientInsert & {
  user_id: string;
};

type ClientStatsRow = Pick<Client, 'status' | 'commercial_potential'>;

function normalizeNullableText(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeInput(input: ClientInsert): ClientInsert {
  return {
    ...input,
    name: input.name.trim(),
    document: normalizeNullableText(input.document),
    phone: normalizeNullableText(input.phone),
    whatsapp: normalizeNullableText(input.whatsapp),
    email: normalizeNullableText(input.email),
    city: normalizeNullableText(input.city),
    state: normalizeNullableText(input.state)?.toUpperCase() ?? null,
    farm_name: normalizeNullableText(input.farm_name),
    current_season: normalizeNullableText(input.current_season),
    origin: normalizeNullableText(input.origin),
    notes: normalizeNullableText(input.notes),
    total_area: input.total_area ?? null,
    main_crops: input.main_crops.map((crop) => crop.trim()).filter(Boolean),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
  };
}

function normalizeUpdate(input: ClientUpdate): ClientUpdate {
  const nextInput = { ...input };

  if (typeof nextInput.name === 'string') nextInput.name = nextInput.name.trim();
  if ('document' in nextInput) nextInput.document = normalizeNullableText(nextInput.document ?? null);
  if ('phone' in nextInput) nextInput.phone = normalizeNullableText(nextInput.phone ?? null);
  if ('whatsapp' in nextInput) nextInput.whatsapp = normalizeNullableText(nextInput.whatsapp ?? null);
  if ('email' in nextInput) nextInput.email = normalizeNullableText(nextInput.email ?? null);
  if ('city' in nextInput) nextInput.city = normalizeNullableText(nextInput.city ?? null);
  if ('state' in nextInput) nextInput.state = normalizeNullableText(nextInput.state ?? null)?.toUpperCase() ?? null;
  if ('farm_name' in nextInput) nextInput.farm_name = normalizeNullableText(nextInput.farm_name ?? null);
  if ('current_season' in nextInput) nextInput.current_season = normalizeNullableText(nextInput.current_season ?? null);
  if ('origin' in nextInput) nextInput.origin = normalizeNullableText(nextInput.origin ?? null);
  if ('notes' in nextInput) nextInput.notes = normalizeNullableText(nextInput.notes ?? null);
  if ('main_crops' in nextInput && nextInput.main_crops) {
    nextInput.main_crops = nextInput.main_crops.map((crop) => crop.trim()).filter(Boolean);
  }
  if ('tags' in nextInput && nextInput.tags) {
    nextInput.tags = nextInput.tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return nextInput;
}

export const clientsService = {
  async listClients(filters: ClientFilters = {}): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.search?.trim()) {
      const search = filters.search.trim();
      const searchExpression = [
        `name.ilike.%${search}%`,
        `document.ilike.%${search}%`,
        `city.ilike.%${search}%`,
        `state.ilike.%${search}%`,
        `farm_name.ilike.%${search}%`,
      ].join(',');

      query = query.or(searchExpression);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.commercialPotential && filters.commercialPotential !== 'all') {
      query = query.eq('commercial_potential', filters.commercialPotential);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query.returns<Client[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .returns<Client[]>()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async createClient(input: ClientInsert): Promise<Client> {
    const userId = await authService.requireUserId();
    const row: ClientDatabaseInsert = {
      ...normalizeInput(input),
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(row)
      .select('*')
      .returns<Client[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateClient(id: string, input: ClientUpdate): Promise<Client> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('clients')
      .update(normalizeUpdate(input))
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('*')
      .returns<Client[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteClient(id: string): Promise<void> {
    const userId = await authService.requireUserId();

    const { error } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  },

  async getClientStats(): Promise<ClientStats> {
    const { data, error } = await supabase
      .from('clients')
      .select('status, commercial_potential')
      .is('deleted_at', null)
      .returns<ClientStatsRow[]>();

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    return {
      total: rows.length,
      prospects: rows.filter((client) => client.status === 'prospect').length,
      active: rows.filter((client) => client.status === 'active').length,
      highPotential: rows.filter((client) => client.commercial_potential === 'high').length,
    };
  },
};
