import type { UserSettings, UserSettingsUpdate } from '@/types/settings.types';

import { defaultVisitReportTemplate } from '@/lib/settings-options';
import { authService } from './auth.service';
import { supabase } from './supabase';

const defaultSettings: UserSettingsUpdate = {
  visit_reminder_hours_before: 24,
  enable_visit_reminders: true,
  enable_overdue_visit_alerts: true,
  enable_daily_summary: false,
  daily_summary_time: '07:00',
  default_visit_status: 'completed',
  default_visit_type: 'technical',
  default_agenda_view: 'week',
  whatsapp_visit_template: defaultVisitReportTemplate,
};

export const settingsService = {
  async getMySettings(): Promise<UserSettings> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .returns<UserSettings[]>()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    const { data: createdSettings, error: createError } = await supabase
      .from('user_settings')
      .insert({ user_id: userId })
      .select('*')
      .returns<UserSettings[]>()
      .single();

    if (createError) {
      throw createError;
    }

    return createdSettings;
  },

  async updateMySettings(input: UserSettingsUpdate): Promise<UserSettings> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('user_settings')
      .update(input)
      .eq('user_id', userId)
      .select('*')
      .returns<UserSettings[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async resetMySettingsToDefault(): Promise<UserSettings> {
    return this.updateMySettings(defaultSettings);
  },
};
