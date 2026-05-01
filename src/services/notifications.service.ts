import type { Notification } from '@/types/visit.types';

import { authService } from './auth.service';
import { supabase } from './supabase';

function dueNotificationsQuery() {
  return supabase
    .from('notifications')
    .select('*')
    .or(`scheduled_for.is.null,scheduled_for.lte.${new Date().toISOString()}`);
}

function sortNotifications(notifications: Notification[]) {
  return [...notifications].sort((a, b) => {
    if (a.read_at === null && b.read_at !== null) return -1;
    if (a.read_at !== null && b.read_at === null) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export const notificationsService = {
  async listNotifications(): Promise<Notification[]> {
    const { data, error } = await dueNotificationsQuery()
      .order('created_at', { ascending: false })
      .returns<Notification[]>();

    if (error) {
      throw error;
    }

    return sortNotifications(data ?? []);
  },

  async listUnreadNotifications(): Promise<Notification[]> {
    const { data, error } = await dueNotificationsQuery()
      .is('read_at', null)
      .order('created_at', { ascending: false })
      .returns<Notification[]>();

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async markNotificationAsRead(id: string): Promise<Notification> {
    const userId = await authService.requireUserId();

    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .returns<Notification[]>()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async markAllNotificationsAsRead(): Promise<void> {
    const userId = await authService.requireUserId();

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null)
      .or(`scheduled_for.is.null,scheduled_for.lte.${new Date().toISOString()}`);

    if (error) {
      throw error;
    }
  },

  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .is('read_at', null)
      .or(`scheduled_for.is.null,scheduled_for.lte.${new Date().toISOString()}`);

    if (error) {
      throw error;
    }

    return count ?? 0;
  },
};
