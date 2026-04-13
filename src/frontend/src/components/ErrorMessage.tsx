import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-destructive" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-foreground text-lg mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
          data-ocid="error-retry"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
