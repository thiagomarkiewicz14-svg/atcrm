import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

type TranscriptStatus = 'processing' | 'completed' | 'failed';

interface TranscriptionRequestBody {
  attachmentId?: unknown;
}

interface VisitRelation {
  id: string;
  user_id: string;
  deleted_at: string | null;
}

interface AttachmentRow {
  id: string;
  user_id: string;
  visit_id: string;
  file_type: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  transcript_status: TranscriptStatus | null;
  visit: VisitRelation | VisitRelation[];
}

interface PublicAttachmentRow {
  id: string;
  user_id: string;
  visit_id: string;
  file_type: string;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  caption: string | null;
  transcript_text: string | null;
  transcript_status: TranscriptStatus | null;
  transcript_error: string | null;
  transcript_generated_at: string | null;
  created_at: string;
}

interface OpenAITranscriptionResponse {
  text?: string;
  error?: {
    message?: string;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let processingAttachmentId: string | null = null;
  let supabase: ReturnType<typeof createClient> | null = null;

  try {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Metodo nao permitido.' }, 405);
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const openAiApiKey = getRequiredEnv('OPENAI_API_KEY');
    const storageBucket = Deno.env.get('STORAGE_BUCKET') || 'visit-attachments';
    supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const jwt = getBearerToken(request.headers.get('Authorization'));
    const { data: userData, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !userData.user) {
      return jsonResponse({ error: 'Usuario nao autenticado.' }, 401);
    }

    const body = (await request.json()) as TranscriptionRequestBody;
    const attachmentId = typeof body.attachmentId === 'string' ? body.attachmentId : '';

    if (!attachmentId) {
      return jsonResponse({ error: 'attachmentId e obrigatorio.' }, 400);
    }

    const attachment = await getAttachment(supabase, attachmentId);
    const visit = getVisitRelation(attachment.visit);

    if (attachment.user_id !== userData.user.id || visit.user_id !== userData.user.id) {
      return jsonResponse({ error: 'Anexo nao pertence ao usuario autenticado.' }, 403);
    }

    if (visit.deleted_at !== null) {
      return jsonResponse({ error: 'Visita removida nao pode ser transcrita.' }, 400);
    }

    if (attachment.file_type !== 'audio') {
      return jsonResponse({ error: 'Somente anexos de audio podem ser transcritos.' }, 400);
    }

    if (attachment.transcript_status === 'processing' || attachment.transcript_status === 'completed') {
      return jsonResponse(
        { error: 'Este audio ja esta em processamento ou foi transcrito.' },
        409,
      );
    }

    processingAttachmentId = attachment.id;
    await updateTranscript(supabase, attachment.id, {
      transcript_status: 'processing',
      transcript_text: null,
      transcript_error: null,
      transcript_generated_at: null,
    });

    const { data: audioBlob, error: downloadError } = await supabase.storage
      .from(storageBucket)
      .download(attachment.storage_path);

    if (downloadError || !audioBlob) {
      throw new Error(downloadError?.message || 'Nao foi possivel baixar o audio.');
    }

    const transcriptText = await transcribeAudio(openAiApiKey, audioBlob, attachment);
    await updateTranscript(supabase, attachment.id, {
      transcript_status: 'completed',
      transcript_text: transcriptText,
      transcript_error: null,
      transcript_generated_at: new Date().toISOString(),
    });
    const updatedAttachment = await getPublicAttachment(supabase, attachment.id);

    return jsonResponse({ attachment: updatedAttachment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado ao transcrever audio.';

    if (supabase && processingAttachmentId) {
      await updateTranscript(supabase, processingAttachmentId, {
        transcript_status: 'failed',
        transcript_error: message,
      }).catch(() => {
        // The response below is still the primary error surface for the client.
      });
    }

    return jsonResponse({ error: message }, 500);
  }
});

async function getAttachment(
  supabase: ReturnType<typeof createClient>,
  attachmentId: string,
): Promise<AttachmentRow> {
  const { data, error } = await supabase
    .from('visit_attachments')
    .select(`
      id,
      user_id,
      visit_id,
      file_type,
      storage_path,
      file_name,
      mime_type,
      transcript_status,
      visit:visits!inner(id, user_id, deleted_at)
    `)
    .eq('id', attachmentId)
    .returns<AttachmentRow[]>()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getPublicAttachment(
  supabase: ReturnType<typeof createClient>,
  attachmentId: string,
): Promise<PublicAttachmentRow> {
  const { data, error } = await supabase
    .from('visit_attachments')
    .select('*')
    .eq('id', attachmentId)
    .returns<PublicAttachmentRow[]>()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function getVisitRelation(visit: VisitRelation | VisitRelation[]): VisitRelation {
  return Array.isArray(visit) ? visit[0] : visit;
}

async function updateTranscript(
  supabase: ReturnType<typeof createClient>,
  attachmentId: string,
  values: {
    transcript_status: TranscriptStatus;
    transcript_text?: string | null;
    transcript_error?: string | null;
    transcript_generated_at?: string | null;
  },
) {
  const { error } = await supabase
    .from('visit_attachments')
    .update(values)
    .eq('id', attachmentId);

  if (error) {
    throw error;
  }
}

async function transcribeAudio(
  openAiApiKey: string,
  audioBlob: Blob,
  attachment: AttachmentRow,
) {
  const formData = new FormData();
  const transcriptionModel = Deno.env.get('OPENAI_TRANSCRIPTION_MODEL') || 'gpt-4o-mini-transcribe'; // fallback: 'whisper-1'
  const fileName = attachment.file_name || 'visit-audio';
  const mimeType = attachment.mime_type || audioBlob.type || 'audio/mpeg';
  const audioFile = new File([audioBlob], fileName, { type: mimeType });

  formData.append('model', transcriptionModel);
  formData.append('file', audioFile);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: formData,
  });
  const payload = (await response.json()) as OpenAITranscriptionResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || 'OpenAI nao retornou a transcricao.');
  }

  if (!payload.text?.trim()) {
    throw new Error('Transcricao vazia retornada pela OpenAI.');
  }

  return payload.text.trim();
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Variavel ${name} nao configurada.`);
  }

  return value;
}

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new Error('JWT ausente.');
  }

  return authorizationHeader.replace('Bearer ', '').trim();
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
