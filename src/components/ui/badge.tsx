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
      warning: 'border-[#C8A951]/45 bg-[#C8A951]/20 text-[#1E3A2F]',
      info: 'border-[#C8A951]/35 bg-[#C8A951]/15 text-[#1E3A2F]',
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
