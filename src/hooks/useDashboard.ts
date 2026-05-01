import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '@/services/dashboard.service';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getDashboardSummary,
  });
}

export function useTodayAgenda() {
  return useQuery({
    queryKey: ['dashboard', 'today-agenda'],
    queryFn: dashboardService.getTodayAgenda,
  });
}

export function useUpcomingWeekAgenda() {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-week-agenda'],
    queryFn: dashboardService.getUpcomingWeekAgenda,
  });
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: dashboardService.getDashboardAlerts,
  });
}

export function useClientsWithoutRecentVisit() {
  return useQuery({
    queryKey: ['dashboard', 'clients-without-recent-visit'],
    queryFn: dashboardService.getClientsWithoutRecentVisit,
  });
}

export function useRecentClients() {
  return useQuery({
    queryKey: ['dashboard', 'recent-clients'],
    queryFn: dashboardService.getRecentClients,
  });
}
