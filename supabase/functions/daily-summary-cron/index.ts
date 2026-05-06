import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

type ClientStatus = 'prospect' | 'active' | 'inactive' | 'lost';
type CommercialPotential = 'low' | 'medium' | 'high';
type VisitStatus = 'scheduled' | 'completed' | 'canceled';

interface UserSettingsRow {
  user_id: string;
  enable_daily_summary: boolean;
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled';
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
}

interface ClientRow {
  id: string;
  user_id: string;
  name: string;
  status: ClientStatus;
  commercial_potential: CommercialPotential;
  created_at: string;
}

interface VisitRow {
  id: string;
  user_id: string;
  client_id: string;
  visit_date: string;
  next_visit_at: string | null;
  status: VisitStatus;
}

interface DailySummary {
  text: string;
  priorities: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: settingsRows, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id, enable_daily_summary, subscription_status')
      .eq('enable_daily_summary', true)
      .in('subscription_status', ['trial', 'active'])
      .returns<UserSettingsRow[]>();

    if (settingsError) {
      throw settingsError;
    }

    const results: Array<{ userId: string; sentWhatsApp: boolean; error?: string }> = [];

    for (const settings of settingsRows ?? []) {
      try {
        const summary = await buildSummaryForUser(supabase, settings.user_id);
        const profile = await getProfile(supabase, settings.user_id);
        const sentWhatsApp = profile?.phone
          ? await sendWhatsApp(supabaseUrl, serviceRoleKey, profile.phone, summary.text)
          : false;

        results.push({ userId: settings.user_id, sentWhatsApp });
      } catch (error) {
        results.push({
          userId: settings.user_id,
          sentWhatsApp: false,
          error: error instanceof Error ? error.message : 'Erro ao gerar resumo diário.',
        });
      }
    }

    return jsonResponse({ processed: results.length, results });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Erro inesperado no resumo diário.' },
      500,
    );
  }
});

async function buildSummaryForUser(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<DailySummary> {
  const [profile, clients, visits] = await Promise.all([
    getProfile(supabase, userId),
    getClients(supabase, userId),
    getVisits(supabase, userId),
  ]);
  const firstName = profile?.full_name?.trim().split(' ')[0] || 'operador';
  const overdueVisits = visits.filter(
    (visit) =>
      visit.next_visit_at !== null &&
      new Date(visit.next_visit_at).getTime() < Date.now() &&
      visit.status !== 'canceled',
  );
  const riskClients = getRiskClients(clients, visits);
  const opportunities = clients.filter(
    (client) => client.commercial_potential === 'high' && client.status !== 'lost',
  );
  const priorities = [...new Set([
    ...overdueVisits.map((visit) => clients.find((client) => client.id === visit.client_id)?.name).filter(isString),
    ...riskClients.map((client) => client.name),
    ...opportunities.map((client) => client.name),
  ])].slice(0, 3);
  const priorityLines =
    priorities.length > 0
      ? priorities.map((name, index) => `${index + 1}. ${name}`).join('\n')
      : 'Carteira sob controle hoje.';

  return {
    priorities,
    text: `Bom dia, ${firstName}.

Seu campo hoje:

🚨 ${riskClients.length} clientes em risco
📍 ${priorities.length} visitas recomendadas
⏰ ${overdueVisits.length} atrasos
🌱 ${opportunities.length} oportunidades
📄 0 propostas

Prioridade:
${priorityLines}`,
  };
}

async function getProfile(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone')
    .eq('id', userId)
    .returns<ProfileRow[]>()
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getClients(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('id, user_id, name, status, commercial_potential, created_at')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .returns<ClientRow[]>();

  if (error) throw error;
  return data ?? [];
}

async function getVisits(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('id, user_id, client_id, visit_date, next_visit_at, status')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .returns<VisitRow[]>();

  if (error) throw error;
  return data ?? [];
}

function getRiskClients(clients: ClientRow[], visits: VisitRow[]) {
  const cutoff = Date.now() - 30 * 86_400_000;
  const lastVisitByClient = new Map<string, string>();

  visits.forEach((visit) => {
    const current = lastVisitByClient.get(visit.client_id);

    if (!current || new Date(visit.visit_date).getTime() > new Date(current).getTime()) {
      lastVisitByClient.set(visit.client_id, visit.visit_date);
    }
  });

  return clients.filter((client) => {
    const lastVisitAt = lastVisitByClient.get(client.id);
    return !lastVisitAt || new Date(lastVisitAt).getTime() < cutoff;
  });
}

async function sendWhatsApp(supabaseUrl: string, serviceRoleKey: string, phone: string, message: string) {
  const response = await fetch(`${supabaseUrl}/functions/v1/send-whatsapp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: phone, message }),
  });

  return response.ok;
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Variável ${name} não configurada.`);
  }

  return value;
}

function isString(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
