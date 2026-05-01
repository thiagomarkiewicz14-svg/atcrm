import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MultiCheckboxFieldProps {
  label: string;
  values: string[];
  options: readonly string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiCheckboxField({ label, values, options, onChange, className }: MultiCheckboxFieldProps) {
  const normalizedOptions = [...options];

  values.forEach((value) => {
    if (value && !normalizedOptions.includes(value)) {
      normalizedOptions.push(value);
    }
  });

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }

    onChange([...values, value]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto rounded-2xl border border-input bg-white p-3 shadow-sm sm:grid-cols-2">
        {normalizedOptions.map((option) => (
          <label
            key={option}
            className="flex min-h-9 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm transition-colors hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => toggleValue(option)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
