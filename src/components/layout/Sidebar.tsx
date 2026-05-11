import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/brand/Logo';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

import { navItems } from './navigation';

export function Sidebar() {
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data ?? 0;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-[#C8A951]/25 bg-[#1E3A2F] px-4 py-5 text-white shadow-[8px_0_32px_rgba(17,17,17,0.12)] md:flex">
      <NavLink
        to="/"
        className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3"
        aria-label="ATC CRM"
      >
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
                'group flex min-h-12 items-center gap-3 rounded-xl border border-transparent px-3 text-xs font-black uppercase tracking-[0.08em] text-white/75 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white',
                isActive && 'border-[#C8A951]/70 bg-[#2D6A4F] text-white shadow-[inset_4px_0_0_#C8A951] hover:bg-[#2D6A4F]',
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

      <div className="mt-auto rounded-2xl border border-[#C8A951]/25 bg-white/[0.06] p-4 shadow-[inset_0_1px_0_rgba(248,249,247,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#C8A951]">ATC CRM</p>
        <p className="mt-2 text-sm font-medium leading-5 text-white/70">Assistente Técnico do Campo.</p>
        <p className="mt-4 h-1 rounded-full bg-[#C8A951]" />
      </div>
    </aside>
  );
}
