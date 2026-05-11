import { cn } from '@/lib/utils';

type LogoVariant = 'full' | 'compact' | 'icon';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

const logoSrc = '/brand/atc-logo-official.png';
const symbolSrc = '/brand/atc-symbol-official.png';
const appIconSrc = '/brand/atc-app-icon-official.png';

function BrandSymbol({ className }: { className?: string }) {
  return (
    <img
      src={appIconSrc}
      alt=""
      className={cn(
        'h-10 w-10 shrink-0 rounded-xl object-contain',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <BrandSymbol className={className} />;
  }

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center', className)} aria-label="ATC CRM">
        <img src={symbolSrc} alt="" className="h-12 w-auto max-w-[11.5rem] object-contain" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center', className)} aria-label="ATC CRM">
      <img src={logoSrc} alt="" className="h-16 w-auto max-w-[16rem] object-contain" aria-hidden="true" />
    </span>
  );
}
