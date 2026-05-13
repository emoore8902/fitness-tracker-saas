import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/workout-plans
const placeholderPlans = [
  { id: 1, name: 'Push / Pull / Legs', goal: 'Hypertrophy', days: 6, exercises: 18 },
  { id: 2, name: 'Starting Strength', goal: 'Strength', days: 3, exercises: 5 },
  { id: 3, name: 'Full Body 3x', goal: 'General Fitness', days: 3, exercises: 9 },
];

const goalVariant: Record<string, string> = {
  Hypertrophy: 'success',
  Strength: 'primary',
  'General Fitness': 'info',
};

export default function WorkoutPlansPage() {
  const plans = placeholderPlans;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Workout Plans</h2>
        <Button variant="primary">+ New Plan</Button>
      </div>

      {plans.length > 0 ? (
        <Row className="g-4">
          {plans.map((plan) => (
            <Col key={plan.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{plan.name}</Card.Title>
                    <Badge bg={goalVariant[plan.goal] ?? 'secondary'}>{plan.goal}</Badge>
                  </div>
                  <p className="text-muted small mb-3">
                    {plan.days} days/week · {plan.exercises} exercises
                  </p>
                  <div className="d-flex gap-2">
                    <Link to="/app/workout-logs" className="btn btn-primary btn-sm flex-grow-1">
                      Start Workout
                    </Link>
                    <Button variant="outline-secondary" size="sm">Edit</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyState
          icon="📋"
          message="No workout plans yet"
          hint="Create your first plan to get started."
          action={<Button variant="primary">+ New Plan</Button>}
        />
      )}
    </>
  );
}
