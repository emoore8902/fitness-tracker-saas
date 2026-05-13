import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  message: string;
  hint?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = '📭', message, hint, action }: EmptyStateProps) {
  return (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: '3rem' }} className="mb-3">{icon}</div>
      <p className="fw-semibold mb-1">{message}</p>
      {hint && <p className="small mb-3">{hint}</p>}
      {action}
    </div>
  );
}
