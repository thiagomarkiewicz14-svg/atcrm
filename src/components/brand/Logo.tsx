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
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10',
        className,
      )}
      aria-hidden="true"
    >
      <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="34" height="34" rx="10" fill="#1B4332" />
        <path
          d="M10 29C12.7 20.8 16.6 14.4 23 9"
          stroke="#D4A373"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M16.2 30C18 23.1 21.1 17.2 27 12"
          stroke="#F3D2A2"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M22.6 29.2C23.8 24.6 26.1 20.6 30.5 16.5"
          stroke="#D4A373"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M9 20.5H30.5" stroke="white" strokeOpacity="0.22" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 25H27" stroke="white" strokeOpacity="0.16" strokeWidth="1.5" strokeLinecap="round" />
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
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-[0.02em]">ATC</span>
          <span className="text-[0.62rem] font-black tracking-[0.24em] text-muted-foreground">CRM</span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3 text-primary', className)}>
      <FieldRowsIcon className="border-primary/20 bg-primary/10" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-[0.02em]">ATC</span>
        <span className="text-xs font-semibold tracking-[0.28em] text-muted-foreground">CRM</span>
      </span>
    </span>
  );
}
