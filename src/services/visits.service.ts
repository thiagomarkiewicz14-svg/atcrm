import type { Visit, VisitFilters, VisitInsert, VisitStats, VisitUpdate } from '@/types/visit.types';

import { authService } from './auth.service';
import { supabase } from './supabase';

type VisitDatabaseInsert = VisitInsert & {
  user_id: string;
};

type VisitStatsRow = Pick<Visit, 'status' | 'next_visit_at'>;

const visitSelect = `
  *,
  clients:client_id(id,name,city,state,whatsapp),
  farms:farm_id(id,name,city,state),
  visit_attachments(id)
`;

function normalizeNullableText(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeInput(input: VisitInsert): VisitInsert {
  return {
    ...input,
    farm_id: input.farm_id || null,
    purpose: input.purpose.trim(),
    summary: normalizeNullableText(input.summary),
    recommendations: normalizeNullableText(input.recommendations),
    next_visit_at: input.next_visit_at || null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  };
}

function normalizeUpdate(input: VisitUpdate): VisitUpdate {
  const nextInput = { ...input };

  if ('farm_id' in nextInput) nextInput.farm_id = nextInput.farm_id || null;
  if (typeof nextInput.purpose === 'string') nextInput.purpose = nextInput.purpose.trim();
  if ('summary' in nextInput) nextInput.summary = normalizeNullableText(nextInput.summary ?? null);
  if ('recommendations' in nextInput) {
    nextInput.recommendations = normalizeNullableText(nextInput.recommendations ?? null);
  }
  if ('next_visit_at' in nextInput) nextInput.next_visit_at = nextInput.next_visit_at || null;
  if ('latitude' in nextInput) nextInput.latitude = nextInput.latitude ?? null;
  if ('longitude' in nextInput) nextInput.longitude = nextInput.longitude ?? null;

  return nextInput;
}

function applyVisitFilters(query: ReturnType<typeof baseVisitsQuery>, filters: VisitFilters) {
  let nextQuery = query;

  if (filters.status && filters.status !== 'all') {
    nextQuery = nextQuery.eq('status', filters.status);
  }

  if (filters.clientId && filters.clientId !== 'all') {
    nextQuery = nextQuery.eq('client_id', filters.clientId);
  }

  if (filters.limit) {
    nextQuery = nextQuery.limit(filters.limit);
  }

  return nextQuery;
}

function baseVisitsQuery() {
  return supabase.from('visits').select(visitSelect).is('deleted_at', null);
}

export const visitsService = {
  async listVisits(filters: VisitFilters = {}): Promise<Visit[]> {
    const query = applyVisitFilters(
      baseVisitsQuery().order('visit_date', { ascending: false }),
      filters,
    );

    const { data, error } = await query.returns<Visit[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async listVisitsByClient(clientId: string): Promise<Visit[]> {
    const { data, error } = await baseVisitsQuery()
      .eq('client_id', clientId)
      .order('visit_date', { ascending: false })
      .returns<Visit[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async getVisitById(id: string): Promise<Visit | null> {
    const { data, error } = await baseVisitsQuery()
      .eq('id', id)
      .returns<Visit[]>()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async createVisit(input: VisitInsert): Promise<Visit> {
    const userId = await authService.requireUserId();
    const row: VisitDatabaseInsert = {
      ...normalizeInput(input),
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('visits')
      .insert(row)
      .select(visitSelect)
      .returns<Visit[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateVisit(id: string, input: VisitUpdate): Promise<Visit> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('visits')
      .update(normalizeUpdate(input))
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select(visitSelect)
      .returns<Visit[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteVisit(id: string): Promise<void> {
    const userId = await authService.requireUserId();

    const { error } = await supabase
      .from('visits')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  },

  async getUpcomingVisits(): Promise<Visit[]> {
    const { data, error } = await baseVisitsQuery()
      .not('next_visit_at', 'is', null)
      .gte('next_visit_at', new Date().toISOString())
      .neq('status', 'canceled')
      .order('next_visit_at', { ascending: true })
      .limit(5)
      .returns<Visit[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async getVisitStats(): Promise<VisitStats> {
    const { data, error } = await supabase
      .from('visits')
      .select('status, next_visit_at')
      .is('deleted_at', null)
      .returns<VisitStatsRow[]>();

    if (error) {
      throw error;
    }

    const rows = data ?? [];
    const now = Date.now();

    return {
      total: rows.length,
      scheduled: rows.filter((visit) => visit.status === 'scheduled').length,
      completed: rows.filter((visit) => visit.status === 'completed').length,
      canceled: rows.filter((visit) => visit.status === 'canceled').length,
      upcoming: rows.filter(
        (visit) =>
          visit.status !== 'canceled' &&
          visit.next_visit_at !== null &&
          new Date(visit.next_visit_at).getTime() >= now,
      ).length,
    };
  },
};
