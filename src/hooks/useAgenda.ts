import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  formatAgendaWeekRange,
  startOfMonth,
  startOfWeek,
} from '@/lib/agenda';
import { agendaService } from '@/services/agenda.service';
import type { AgendaViewMode } from '@/types/agenda.types';

export function useAgendaEvents(startDate: Date, endDate: Date) {
  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  return useQuery({
    queryKey: ['agenda-events', startIso, endIso],
    queryFn: () =>
      agendaService.listAgendaEvents({
        startDate: startIso,
        endDate: endIso,
      }),
  });
}

export function useAgendaNavigation(defaultMode?: AgendaViewMode) {
  const [mode, setMode] = useState<AgendaViewMode>('week');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const hasAppliedDefaultMode = useRef(false);

  useEffect(() => {
    if (defaultMode && !hasAppliedDefaultMode.current) {
      setMode(defaultMode);
      hasAppliedDefaultMode.current = true;
    }
  }, [defaultMode]);

  const period = useMemo(() => {
    if (mode === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);

      return {
        start,
        end,
        title: formatAgendaWeekRange(start, end),
      };
    }

    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    return {
      start,
      end,
      title: new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
      }).format(currentDate),
    };
  }, [currentDate, mode]);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const goToPrevious = () => {
    setCurrentDate((date) => (mode === 'week' ? addWeeks(date, -1) : addMonths(date, -1)));
  };

  const goToNext = () => {
    setCurrentDate((date) => (mode === 'week' ? addWeeks(date, 1) : addMonths(date, 1)));
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  return {
    mode,
    currentDate,
    selectedDate,
    periodStart: period.start,
    periodEnd: period.end,
    periodTitle: period.title,
    goToToday,
    goToPrevious,
    goToNext,
    setSelectedDate: selectDate,
    setMode,
  };
}
