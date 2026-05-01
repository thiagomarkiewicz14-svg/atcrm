import type { ChangeEvent } from 'react';

import { Label } from '@/components/ui/label';
import { BRAZILIAN_STATES, getCitiesByState, isBrazilianStateCode } from '@/lib/brazil-locations';
import { cn } from '@/lib/utils';

interface LocationFieldsProps {
  stateValue: string | null;
  cityValue: string | null;
  onStateChange: (value: string | null) => void;
  onCityChange: (value: string | null) => void;
  className?: string;
}

const selectClassName =
  'h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/15 disabled:bg-background disabled:text-muted-foreground';

export function LocationFields({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
  className,
}: LocationFieldsProps) {
  const normalizedState = stateValue?.toUpperCase() ?? '';
  const cities = getCitiesByState(normalizedState);
  const cityOptions = cityValue && !cities.includes(cityValue) ? [cityValue, ...cities] : cities;
  const hasKnownState = isBrazilianStateCode(normalizedState);

  const handleStateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextState = event.target.value || null;
    onStateChange(nextState);
    onCityChange(null);
  };

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-[8rem_1fr]', className)}>
      <div className="space-y-2">
        <Label>Estado</Label>
        <select className={cn(selectClassName)} value={normalizedState} onChange={handleStateChange}>
          <option value="">Selecione</option>
          {!hasKnownState && normalizedState ? <option value={normalizedState}>{normalizedState}</option> : null}
          {BRAZILIAN_STATES.map((state) => (
            <option key={state.uf} value={state.uf}>
              {state.uf}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Cidade</Label>
        <select
          className={cn(selectClassName)}
          value={cityValue ?? ''}
          onChange={(event) => onCityChange(event.target.value || null)}
          disabled={!normalizedState || cityOptions.length === 0}
        >
          <option value="">{normalizedState ? 'Selecione' : 'Escolha o estado'}</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
