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
      <section className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Notificações</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unreadCount} não lida{unreadCount === 1 ? '' : 's'}.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead.mutate()}
          disabled={unreadCount === 0 || markAllAsRead.isPending}
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
    <Card className={cn(isUnread && 'border-primary/50', isDue && isUnread && 'bg-primary/5')}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <Bell className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-base font-bold">{notification.title}</h2>
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
