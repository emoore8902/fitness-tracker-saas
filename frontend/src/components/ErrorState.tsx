interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-5 text-danger">
      <div style={{ fontSize: '2.5rem' }} className="mb-3">⚠️</div>
      <p className="fw-semibold mb-2">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
