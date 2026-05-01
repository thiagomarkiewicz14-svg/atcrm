import { Link } from 'react-router-dom';
import { CalendarClock, FileText, MapPinned, Paperclip } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/formatters';
import { getVisitStatusLabel, getVisitTypeLabel } from '@/lib/visit-options';
import type { Visit } from '@/types/visit.types';

interface VisitCardProps {
  visit: Visit;
  showClient?: boolean;
}

export function VisitCard({ visit, showClient = true }: VisitCardProps) {
  const attachmentsCount = visit.visit_attachments?.length ?? 0;

  return (
    <Link to={`/visits/${visit.id}`} className="group block">
      <Card className="transition-colors duration-200 group-hover:border-primary/35">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <CalendarClock className="h-4 w-4" />
                {formatDateTime(visit.visit_date)}
              </p>
              <h3 className="line-clamp-2 text-lg font-semibold leading-tight">{visit.purpose}</h3>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge>{getVisitTypeLabel(visit.visit_type)}</Badge>
              <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
                {getVisitStatusLabel(visit.status)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-background p-3 text-sm text-muted-foreground">
            {showClient && visit.clients ? (
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{visit.clients.name}</span>
              </p>
            ) : null}
            {visit.farms ? (
              <p className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{visit.farms.name}</span>
              </p>
            ) : null}
            {visit.summary ? <p className="line-clamp-2">{visit.summary}</p> : null}
            {visit.next_visit_at ? (
              <p className="font-medium text-[#B85E1B]">Próxima visita: {formatDateTime(visit.next_visit_at)}</p>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Paperclip className="h-3.5 w-3.5" />
            {attachmentsCount} anexo{attachmentsCount === 1 ? '' : 's'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
