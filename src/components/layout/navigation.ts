import { Bell, CalendarDays, Home, Route, UsersRound, UserRound } from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Campo', icon: Home, end: true },
  { to: '/clients', label: 'Carteira', icon: UsersRound, end: false },
  { to: '/agenda', label: 'Rota', icon: CalendarDays, end: false },
  { to: '/visits', label: 'Visitas', icon: Route, end: false },
  { to: '/notifications', label: 'Alertas', icon: Bell, end: false },
  { to: '/profile', label: 'Operador', icon: UserRound, end: false },
];

export function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Campo';
  if (pathname.startsWith('/clients/new')) return 'Novo cliente';
  if (pathname.startsWith('/clients')) return 'Carteira';
  if (pathname.startsWith('/agenda')) return 'Rota';
  if (pathname.startsWith('/visits/new')) return 'Nova visita';
  if (pathname.startsWith('/visits')) return 'Visitas';
  if (pathname.startsWith('/notifications')) return 'Alertas';
  if (pathname.startsWith('/settings')) return 'Configurações';
  if (pathname.startsWith('/profile')) return 'Operador';
  return 'ATC CRM';
}
