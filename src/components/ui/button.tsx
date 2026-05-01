import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-[#1B4332]',
        secondary: 'border border-primary bg-transparent text-primary hover:bg-primary/5',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-[#9F2727]',
        outline: 'border border-border bg-white text-foreground hover:border-primary/40 hover:bg-primary/5',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        link: 'min-h-0 rounded-none px-0 text-primary underline-offset-4 hover:text-[#1B4332] hover:underline active:translate-y-0',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 min-h-9 px-3',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);

Button.displayName = 'Button';
