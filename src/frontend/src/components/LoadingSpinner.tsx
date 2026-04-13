import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const SIZE_CLASSES = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({
  size = "md",
  className = "",
  label = "Loading…",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2
        className={`${SIZE_CLASSES[size]} animate-spin text-primary`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      {size !== "sm" && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" label="Loading…" />
    </div>
  );
}
