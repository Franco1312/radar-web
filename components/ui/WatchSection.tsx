import { cn } from "@/lib/utils";

interface WatchSectionProps {
  watch: string;
  className?: string;
}

export function WatchSection({ watch, className }: WatchSectionProps) {
  return (
    <div className={cn(
      "text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200",
      className
    )}>
      <strong>Qué mirar:</strong> {watch}
    </div>
  );
}
