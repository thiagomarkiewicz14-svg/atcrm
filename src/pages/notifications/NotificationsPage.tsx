import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from '@/hooks/useNotifications';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/visit.types';

export function NotificationsPage() {
  const notificationsQuery = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  if (notificationsQuery.isLoading) {
    return <LoadingState />;
  }

  if (notificationsQuery.isError) {
    return <ErrorState error={notificationsQuery.error} onRetry={() => void notificationsQuery.refetch()} />;
  }

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => notification.read_at === null).length;

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4 rounded-xl border-2 border-[#1E3A2F] bg-[#1E3A2F] p-5 text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">Pressão operacional</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-[0.04em]">Alertas</h1>
          <p className="mt-2 text-sm font-medium text-white/70">
            {unreadCount} pendente{unreadCount === 1 ? '' : 's'} para ação.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => markAllAsRead.mutate()}
          disabled={unreadCount === 0 || markAllAsRead.isPending}
          className="border-white bg-white text-[#1E3A2F] hover:bg-[#C8A951]"
        >
          <CheckCheck className="h-4 w-4" />
          Marcar todas
        </Button>
      </section>

      {markAsRead.isError ? <ErrorState error={markAsRead.error} /> : null}
      {markAllAsRead.isError ? <ErrorState error={markAllAsRead.error} /> : null}

      {notifications.length === 0 ? (
        <EmptyState title="Nenhuma notificação" description="Lembretes de próximas visitas aparecerão aqui." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead.mutate(notification.id)}
              isMarking={markAsRead.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  isMarking,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  isMarking: boolean;
}) {
  const isUnread = notification.read_at === null;
  const isDue =
    notification.scheduled_for === null || new Date(notification.scheduled_for).getTime() <= Date.now();
  const visitLink =
    notification.related_table === 'visits' && notification.related_id ? `/visits/${notification.related_id}` : null;

  return (
    <Card className={cn(isUnread && 'border-[#C53030] bg-[#C53030]/10', isDue && isUnread && 'border-[#C53030]')}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-primary', isUnread ? 'border-[#C53030] bg-[#C53030] text-white' : 'border-primary/25 bg-primary/10')}>
            <Bell className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-base font-black uppercase tracking-[0.02em]">{notification.title}</h2>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
              {notification.scheduled_for
                ? `Agendada para ${formatDateTime(notification.scheduled_for)}`
                : formatDateTime(notification.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {visitLink ? (
            <Link to={visitLink} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Ver visita
            </Link>
          ) : null}
          {isUnread ? (
            <Button type="button" variant="ghost" size="sm" onClick={onMarkAsRead} disabled={isMarking}>
              Marcar como lida
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
