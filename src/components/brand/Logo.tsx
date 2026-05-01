import { cn } from '@/lib/utils';

type LogoVariant = 'full' | 'compact' | 'icon';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

function FieldRowsIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10',
        className,
      )}
      aria-hidden="true"
    >
      <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 22.5C8.1 15.5 11.4 9.8 16.4 4.8"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          className="text-current"
        />
        <path
          d="M12.2 23.3C13.8 16.9 16.5 11.7 21.2 6.9"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          className="text-current"
        />
        <path
          d="M18.3 22.6C19.2 18.3 20.9 14.6 24 11"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          className="text-current"
        />
        <path
          d="M4.4 16.4H22.2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          className="text-current opacity-40"
        />
      </svg>
    </span>
  );
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <FieldRowsIcon className={className} />;
  }

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-2 text-primary', className)}>
        <FieldRowsIcon className="h-9 w-9 rounded-xl border-primary/20 bg-primary/10" />
        <span className="text-lg font-black leading-none tracking-[0.02em]">AT</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3 text-primary', className)}>
      <FieldRowsIcon className="border-primary/20 bg-primary/10" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-[0.02em]">AT</span>
        <span className="text-xs font-semibold tracking-[0.28em] text-muted-foreground">CRM</span>
      </span>
    </span>
  );
}
