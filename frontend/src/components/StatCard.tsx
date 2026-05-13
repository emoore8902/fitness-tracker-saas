import { Card } from 'react-bootstrap';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'success' | 'info' | 'warning';
}

export default function StatCard({ title, value, subtitle, variant = 'primary' }: StatCardProps) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="text-center py-4">
        <p className="text-muted small mb-1 text-uppercase fw-semibold">{title}</p>
        <h2 className={`display-5 fw-bold text-${variant} mb-1`}>{value}</h2>
        {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
      </Card.Body>
    </Card>
  );
}
