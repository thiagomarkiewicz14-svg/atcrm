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
        'flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#1E3A2F]/30 bg-[#F8F9F7] p-6 text-center shadow-[inset_0_1px_0_rgba(200,169,81,0.16)]',
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C8A951]/40 bg-[#C8A951]/15 text-[#1E3A2F]">
        <Inbox className="h-6 w-6" />
      </span>
      <div className="space-y-1">
        <h2 className="text-base font-black uppercase tracking-[0.04em]">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
