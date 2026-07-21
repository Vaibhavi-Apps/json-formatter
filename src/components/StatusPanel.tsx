import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export type StatusType = 'idle' | 'success' | 'error';

interface StatusPanelProps {
  status: StatusType;
  message: string;
}

export function StatusPanel({ status, message }: StatusPanelProps) {
  let Icon = Info;
  let textColor = 'text-muted-foreground';
  let iconColor = 'text-primary';

  if (status === 'success') {
    Icon = CheckCircle2;
    textColor = 'text-green-600 dark:text-green-400';
    iconColor = 'text-green-600 dark:text-green-400';
  } else if (status === 'error') {
    Icon = AlertTriangle;
    textColor = 'text-destructive';
    iconColor = 'text-destructive';
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 border-b border-border text-sm">
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
      <span className={`truncate ${textColor}`} title={message}>
        {message}
      </span>
    </div>
  );
}
