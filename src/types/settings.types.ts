import type { VisitStatus, VisitType } from './visit.types';

export type VisitReminderHoursBefore = 1 | 3 | 6 | 12 | 24 | 48 | 72 | 168;

export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled';

export type AgendaViewMode = 'week' | 'month';

export interface UserSettings {
  id: string;
  user_id: string;
  visit_reminder_hours_before: VisitReminderHoursBefore;
  enable_visit_reminders: boolean;
  enable_overdue_visit_alerts: boolean;
  enable_daily_summary: boolean;
  daily_summary_time: string;
  default_visit_status: VisitStatus;
  default_visit_type: VisitType;
  default_agenda_view: AgendaViewMode;
  whatsapp_visit_template: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export type UserSettingsUpdate = Partial<
  Pick<
    UserSettings,
    | 'visit_reminder_hours_before'
    | 'enable_visit_reminders'
    | 'enable_overdue_visit_alerts'
    | 'enable_daily_summary'
    | 'daily_summary_time'
    | 'default_visit_status'
    | 'default_visit_type'
    | 'default_agenda_view'
    | 'whatsapp_visit_template'
  >
>;
