import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
  {
  variants: {
    variant: {
      default: 'border-primary/20 bg-primary/10 text-primary',
      secondary: 'border-border bg-secondary text-secondary-foreground',
      muted: 'border-border bg-white text-muted-foreground',
      warning: 'border-[#ED8936]/25 bg-[#ED8936]/10 text-[#B85E1B]',
      info: 'border-[#D4A373]/35 bg-[#D4A373]/15 text-[#7A542D]',
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
