import { cn } from "@/lib/utils";

interface DataNoteProps {
  note: string;
  className?: string;
}

export function DataNote({ note, className }: DataNoteProps) {
  return (
    <div className={cn(
      "text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200",
      className
    )}>
      <strong>Nota:</strong> {note}
    </div>
  );
}
