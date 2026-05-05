import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-48 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#1B4332]/25 bg-[#F3F5F0] p-6 text-center',
        className,
      )}
    >
      <Inbox className="h-8 w-8 text-primary" />
      <div className="space-y-1">
        <h2 className="text-base font-black uppercase tracking-[0.04em]">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
