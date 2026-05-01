import { Edit, MapPin, Rows3, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatArea } from '@/lib/formatters';
import type { Farm } from '@/types/farm.types';

interface FarmCardProps {
  farm: Farm;
  onEdit: (farm: Farm) => void;
  onDelete: (farm: Farm) => void;
  isDeleting?: boolean;
}

export function FarmCard({ farm, onEdit, onDelete, isDeleting = false }: FarmCardProps) {
  const location = [farm.city, farm.state].filter(Boolean).join(' / ');

  return (
    <Card className="transition-colors duration-200 hover:border-primary/55">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <h3 className="truncate text-lg font-semibold">{farm.name}</h3>
            {location ? (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{location}</span>
              </p>
            ) : null}
          </div>
          <Badge variant="secondary">{formatArea(farm.total_area)}</Badge>
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-background p-3 text-sm">
          {farm.main_crops.length > 0 ? (
            <p className="flex items-start gap-2 text-muted-foreground">
              <Rows3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-2">{farm.main_crops.join(', ')}</span>
            </p>
          ) : null}
          <p className="text-muted-foreground">Safra: {farm.current_season ?? '-'}</p>
          {farm.notes ? <p className="whitespace-pre-wrap text-muted-foreground">{farm.notes}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(farm)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(farm)} disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
