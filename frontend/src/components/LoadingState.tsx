import { Spinner } from 'react-bootstrap';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <Spinner animation="border" variant="primary" className="mb-3" />
      <p className="small mb-0">{message}</p>
    </div>
  );
}
