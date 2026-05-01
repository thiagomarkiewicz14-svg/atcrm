import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { DayEventsList } from '@/components/agenda/DayEventsList';
import { MonthCalendar } from '@/components/agenda/MonthCalendar';
import { WeekCalendar } from '@/components/agenda/WeekCalendar';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { buttonVariants } from '@/components/ui/button';
import { useAgendaEvents, useAgendaNavigation } from '@/hooks/useAgenda';
import { useSettings } from '@/hooks/useSettings';

export function AgendaPage() {
  const settingsQuery = useSettings();
  const agenda = useAgendaNavigation(settingsQuery.data?.default_agenda_view);
  const eventsQuery = useAgendaEvents(agenda.periodStart, agenda.periodEnd);

  const events = eventsQuery.data ?? [];

  return (
    <div className="space-y-5">
      <AgendaHeader
        title={agenda.periodTitle}
        mode={agenda.mode}
        onPrevious={agenda.goToPrevious}
        onNext={agenda.goToNext}
        onToday={agenda.goToToday}
        onModeChange={agenda.setMode}
      />

      <div className="flex justify-end">
        <Link to="/visits/new" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4" />
          Nova visita
        </Link>
      </div>

      {eventsQuery.isLoading ? <LoadingState /> : null}

      {eventsQuery.isError ? (
        <ErrorState error={eventsQuery.error} onRetry={() => void eventsQuery.refetch()} />
      ) : null}

      {eventsQuery.isSuccess ? (
        <>
          {agenda.mode === 'week' ? (
            <WeekCalendar
              currentDate={agenda.currentDate}
              selectedDate={agenda.selectedDate}
              events={events}
              onSelectDate={agenda.setSelectedDate}
            />
          ) : (
            <MonthCalendar
              currentDate={agenda.currentDate}
              selectedDate={agenda.selectedDate}
              events={events}
              onSelectDate={agenda.setSelectedDate}
            />
          )}

          <DayEventsList selectedDate={agenda.selectedDate} events={events} />
        </>
      ) : null}
    </div>
  );
}
