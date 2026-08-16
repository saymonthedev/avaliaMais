import { CalendarDays } from 'lucide-react';
import { useRef } from 'react';

interface DatePickerProps {
  value: string;           // formato YYYY-MM-DD
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

function toDisplay(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function DatePicker({ value, onChange, placeholder = 'dd/mm/aaaa', min, max }: DatePickerProps) {
  const ref = useRef<HTMLInputElement>(null);

  const open = () => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') el.showPicker();
    else el.focus();
  };

  return (
    <div className={`date-picker${!value ? ' date-picker-empty' : ''}`} onClick={open}>
      <CalendarDays size={15} className="date-picker-icon" />
      <span className="date-picker-text">
        {value ? toDisplay(value) : placeholder}
      </span>
      <input
        ref={ref}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="date-picker-native"
        tabIndex={0}
      />
    </div>
  );
}
