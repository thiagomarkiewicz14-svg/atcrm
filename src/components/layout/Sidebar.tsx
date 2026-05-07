import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

import { navItems } from './navigation';

export function Sidebar() {
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data ?? 0;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-[#1E3A2F] px-4 py-5 text-white md:flex">
      <NavLink to="/" className="mb-8 flex items-center gap-3 rounded-2xl px-2 py-1" aria-label="ATC CRM">
        <Logo variant="compact" />
      </NavLink>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex min-h-12 items-center gap-3 rounded-lg border border-transparent px-3 text-xs font-black uppercase tracking-[0.08em] text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white',
                isActive && 'border-[#C8A951] bg-primary text-white hover:bg-primary',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.to === '/notifications' && unreadCount > 0 ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[0.68rem] font-semibold text-[#1E3A2F]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-white/20 bg-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">ATC CRM</p>
        <p className="mt-2 text-sm leading-5 text-white/70">Assistente Técnico do Campo.</p>
      </div>
    </aside>
  );
}
