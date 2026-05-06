import { cn } from '@/lib/utils';

type LogoVariant = 'full' | 'compact' | 'icon';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

const symbolSrc = '/brand/atc-symbol.png';

function BrandSymbol({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-current/20 bg-white/10',
        className,
      )}
      aria-hidden="true"
    >
      <img src={symbolSrc} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <BrandSymbol className={className} />;
  }

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-2 text-primary', className)} aria-label="ATC CRM">
        <BrandSymbol className="h-9 w-9 rounded-xl bg-transparent" />
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-[0.02em]">ATC</span>
          <span className="text-[0.62rem] font-black tracking-[0.24em] text-[#C8A951]">CRM</span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3 text-primary', className)} aria-label="ATC CRM">
      <BrandSymbol className="bg-transparent" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-[0.02em]">ATC</span>
        <span className="text-xs font-black tracking-[0.28em] text-[#C8A951]">CRM</span>
      </span>
    </span>
  );
}
