import { Bell, CalendarDays, Home, Route, UsersRound, UserRound } from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/clients', label: 'Clientes', icon: UsersRound, end: false },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays, end: false },
  { to: '/visits', label: 'Visitas', icon: Route, end: false },
  { to: '/notifications', label: 'Notificações', icon: Bell, end: false },
  { to: '/profile', label: 'Perfil', icon: UserRound, end: false },
];

export function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/clients/new')) return 'Novo cliente';
  if (pathname.startsWith('/clients')) return 'Clientes';
  if (pathname.startsWith('/agenda')) return 'Agenda';
  if (pathname.startsWith('/visits/new')) return 'Nova visita';
  if (pathname.startsWith('/visits')) return 'Visitas';
  if (pathname.startsWith('/notifications')) return 'Notificações';
  if (pathname.startsWith('/settings')) return 'Configurações';
  if (pathname.startsWith('/profile')) return 'Perfil';
  return 'AT CRM';
}
