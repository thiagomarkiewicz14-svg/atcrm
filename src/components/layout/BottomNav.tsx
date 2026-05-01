import { NavLink } from 'react-router-dom';

import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

import { navItems } from './navigation';

const mobileNavItems = navItems.filter((item) =>
  ['/', '/clients', '/agenda', '/notifications', '/profile'].includes(item.to),
);

export function BottomNav() {
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data ?? 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white shadow-sm md:hidden">
      <div className="grid h-20 grid-cols-5 px-1">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.68rem] font-medium text-muted-foreground transition-colors',
                isActive && 'text-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'relative rounded-xl p-1.5 transition-colors group-hover:bg-primary/5',
                    isActive && 'bg-primary/10',
                  )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  {item.to === '/notifications' && unreadCount > 0 ? (
                    <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.62rem] font-bold leading-none text-destructive-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
