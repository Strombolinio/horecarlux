import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DateRangePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  disabled = false,
}: DateRangePickerProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const today = new Date();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Check-in */}
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
          Check-in
        </p>
        <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="w-full justify-start text-left font-normal gap-2"
              data-ocid="checkin-input"
            >
              <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              {checkIn ? (
                format(checkIn, "MMM d, yyyy")
              ) : (
                <span className="text-muted-foreground">Check-in date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => {
                onCheckInChange(date);
                if (date && checkOut && date >= checkOut) {
                  onCheckOutChange(undefined);
                }
                setCheckInOpen(false);
              }}
              disabled={(date) => date < today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check-out */}
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
          Check-out
        </p>
        <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="w-full justify-start text-left font-normal gap-2"
              data-ocid="checkout-input"
            >
              <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              {checkOut ? (
                format(checkOut, "MMM d, yyyy")
              ) : (
                <span className="text-muted-foreground">Check-out date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={(date) => {
                onCheckOutChange(date);
                setCheckOutOpen(false);
              }}
              disabled={(date) =>
                date < today || (checkIn ? date <= checkIn : false)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
