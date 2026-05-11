import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-12 w-full rounded-xl border-2 border-[#1E3A2F]/15 bg-white/90 px-3.5 py-2 text-sm font-medium text-foreground shadow-none outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
