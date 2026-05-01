import { Link, useLocation } from 'react-router-dom';
import { Bell, UserRound } from 'lucide-react';

import { Logo } from '@/components/brand/Logo';
import { buttonVariants } from '@/components/ui/button';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

import { getPageTitle } from './navigation';

export function TopBar() {
  const location = useLocation();
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data ?? 0;
  const title = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 md:hidden" aria-label="AT CRM">
          <Logo variant="compact" />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
        </div>

        <Link
          to="/notifications"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative shrink-0')}
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.62rem] font-bold leading-none text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Link>

        <Link
          to="/profile"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'shrink-0')}
          aria-label="Perfil"
        >
          <UserRound className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
