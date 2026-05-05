import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em]',
  {
  variants: {
    variant: {
      default: 'border-primary/20 bg-primary/10 text-primary',
      secondary: 'border-border bg-secondary text-secondary-foreground',
      muted: 'border-border bg-white text-muted-foreground',
      warning: 'border-[#ED8936]/25 bg-[#ED8936]/10 text-[#B85E1B]',
      info: 'border-[#D4A373]/30 bg-[#D4A373]/20 text-[#7A542D]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
