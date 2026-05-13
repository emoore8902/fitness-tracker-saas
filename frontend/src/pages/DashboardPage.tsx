import { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/dashboardApi';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import RecentWorkoutsTable from '../components/dashboard/RecentWorkoutsTable';
import WeeklyActivityChart from '../components/dashboard/WeeklyActivityChart';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import type { DashboardData } from '../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboard();
      setData(result);
    } catch {
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Dashboard</h2>
          <p className="text-muted small mb-0">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </p>
        </div>
        <Link to="/app/workout-logs" className="btn btn-primary">
          + Log Workout
        </Link>
      </div>

      {loading && <LoadingState message="Loading your dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchDashboard} />
      )}

      {!loading && !error && data && (
        <>
          {/* 4 Stat Cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} lg={3}>
              <StatCard
                title="This Week"
                value={data.stats.workouts_this_week}
                subtitle="Sessions logged"
                variant="primary"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Total Volume"
                value={data.stats.total_volume_kg > 0 ? `${data.stats.total_volume_kg} kg` : '—'}
                subtitle="All time"
                variant="success"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Streak"
                value={data.stats.current_streak > 0 ? `${data.stats.current_streak}d` : '—'}
                subtitle="Current streak"
                variant="warning"
              />
            </Col>
            <Col xs={6} lg={3}>
              <StatCard
                title="Top Exercise"
                value={data.stats.favorite_exercise ?? '—'}
                subtitle="Most logged"
                variant="info"
              />
            </Col>
          </Row>

          <Row className="g-4">
            {/* Recent Activity */}
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                  <span className="fw-semibold">Recent Activity</span>
                  <Link to="/app/history" className="btn btn-sm btn-outline-secondary">
                    View All
                  </Link>
                </Card.Header>
                <Card.Body className="p-0">
                  <RecentWorkoutsTable workouts={data.recent_workouts} />
                </Card.Body>
              </Card>
            </Col>

            {/* Right column */}
            <Col lg={4}>
              <div className="d-flex flex-column gap-3">
                {/* Quick Actions */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <span className="fw-semibold">Quick Actions</span>
                  </Card.Header>
                  <Card.Body className="d-grid gap-2">
                    <Link to="/app/workout-logs" className="btn btn-primary">
                      🏋️ Log a Workout
                    </Link>
                    <Link to="/app/workout-plans" className="btn btn-outline-primary">
                      📋 View My Plans
                    </Link>
                    <Link to="/app/exercises" className="btn btn-outline-secondary">
                      🔍 Browse Exercises
                    </Link>
                  </Card.Body>
                </Card>

                <WeeklyActivityChart activity={data.weekly_activity} />
                <ProgressSummary workoutsThisWeek={data.stats.workouts_this_week} />
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
