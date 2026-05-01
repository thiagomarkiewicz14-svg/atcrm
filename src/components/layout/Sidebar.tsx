import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

import { navItems } from './navigation';

export function Sidebar() {
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data ?? 0;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-[#1B4332] px-5 py-6 text-white md:flex">
      <NavLink to="/" className="mb-8 flex items-center gap-3 rounded-2xl px-2 py-1" aria-label="AT CRM">
        <Logo variant="full" className="text-white [&_span:last-child_span:last-child]:text-white/65" />
      </NavLink>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/78 transition-colors hover:bg-white/8 hover:text-white',
                isActive && 'bg-primary text-white shadow-sm hover:bg-primary',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.to === '/notifications' && unreadCount > 0 ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[0.68rem] font-semibold text-[#1B4332]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-white/8 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">AT CRM</p>
        <p className="mt-2 text-sm leading-5 text-white/72">Gestão inteligente para o agronegócio.</p>
      </div>
    </aside>
  );
}
