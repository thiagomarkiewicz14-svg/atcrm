export type VisitType =
  | 'technical'
  | 'commercial'
  | 'follow_up'
  | 'post_sale'
  | 'prospecting'
  | 'collection'
  | 'other';

export type VisitStatus = 'scheduled' | 'completed' | 'canceled';

export type VisitAttachmentType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface VisitClientSummary {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  whatsapp?: string | null;
}

export interface VisitFarmSummary {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

export interface VisitAttachment {
  id: string;
  user_id: string;
  visit_id: string;
  file_type: VisitAttachmentType;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  caption: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  user_id: string;
  client_id: string;
  farm_id: string | null;
  visit_date: string;
  visit_type: VisitType;
  purpose: string;
  summary: string | null;
  recommendations: string | null;
  next_visit_at: string | null;
  status: VisitStatus;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  clients?: VisitClientSummary | null;
  farms?: VisitFarmSummary | null;
  visit_attachments?: Pick<VisitAttachment, 'id'>[];
}

export type VisitInsert = Pick<
  Visit,
  | 'client_id'
  | 'farm_id'
  | 'visit_date'
  | 'visit_type'
  | 'purpose'
  | 'summary'
  | 'recommendations'
  | 'next_visit_at'
  | 'status'
  | 'latitude'
  | 'longitude'
>;

export type VisitUpdate = Partial<VisitInsert>;

export type VisitAttachmentInsert = Pick<
  VisitAttachment,
  'visit_id' | 'file_type' | 'storage_path' | 'file_name' | 'mime_type' | 'file_size' | 'caption'
>;

export interface VisitFilters {
  status?: VisitStatus | 'all';
  clientId?: string | 'all';
  limit?: number;
}

export interface VisitStats {
  total: number;
  scheduled: number;
  completed: number;
  canceled: number;
  upcoming: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_table: string | null;
  related_id: string | null;
  scheduled_for: string | null;
  read_at: string | null;
  created_at: string;
}
