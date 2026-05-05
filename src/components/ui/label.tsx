import * as React from 'react';

import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-[0.68rem] font-black uppercase tracking-[0.08em] leading-none text-muted-foreground', className)}
    {...props}
  />
));

Label.displayName = 'Label';
