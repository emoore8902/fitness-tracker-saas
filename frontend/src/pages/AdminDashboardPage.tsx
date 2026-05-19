import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getAdminStats } from '../api/adminApi';
import type { AdminStats } from '../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch {
      setError('Failed to load admin stats. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <>
      <div className="mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <p className="text-muted small mb-0">Platform overview</p>
      </div>

      {loading && <LoadingState message="Loading platform stats…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadStats} />}

      {!loading && !error && stats && (
        <>
          <Row className="g-3 mb-4">
            <Col xs={6} lg={3}>
              <StatCard
                title="Total Users"
                value={stats.total_users}
                subtitle="Registered accounts"
                variant="primary"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Total Workouts"
                value={stats.total_workout_logs}
                subtitle="Sessions logged"
                variant="success"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Exercise Library"
                value={stats.total_exercises}
                subtitle="Global + custom"
                variant="info"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Workout Plans"
                value={stats.total_workout_plans}
                subtitle="Across all users"
                variant="warning"
              />
            </Col>
          </Row>

          {/* Quick Links */}
          <h5 className="fw-semibold mb-3">Admin Sections</h5>
          <Row className="g-3">
            {[
              { to: '/app/admin/users', icon: '👥', label: 'Manage Users', desc: 'View all registered users' },
              { to: '/app/admin/categories', icon: '🏷️', label: 'Exercise Categories', desc: 'Add and manage categories' },
              { to: '/app/admin/exercises', icon: '🏋️', label: 'Global Exercises', desc: 'Manage the exercise library' },
            ].map((link) => (
              <Col key={link.to} md={4}>
                <Card as={Link} to={link.to} className="shadow-sm text-decoration-none h-100" style={{ color: 'inherit' }}>
                  <Card.Body>
                    <div className="fs-3 mb-2">{link.icon}</div>
                    <Card.Title className="h6 mb-1">{link.label}</Card.Title>
                    <p className="text-muted small mb-0">{link.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}
