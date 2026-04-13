import { Minus, Plus, Users } from "lucide-react";
import { Button } from "./ui/button";

interface GuestCountInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function GuestCountInput({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
}: GuestCountInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Guests</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || value <= min}
          aria-label="Decrease guests"
          data-ocid="guest-decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </Button>
        <span
          className="w-8 text-center font-medium text-foreground tabular-nums"
          aria-live="polite"
          aria-label={`${value} guests`}
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={disabled || value >= max}
          aria-label="Increase guests"
          data-ocid="guest-increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
