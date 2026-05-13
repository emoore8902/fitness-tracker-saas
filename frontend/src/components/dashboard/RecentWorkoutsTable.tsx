import { ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EmptyState from '../EmptyState';
import type { RecentWorkout } from '../../types';

interface Props {
  workouts: RecentWorkout[];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function RecentWorkoutsTable({ workouts }: Props) {
  if (workouts.length === 0) {
    return (
      <EmptyState
        icon="🏃"
        message="No workouts logged yet"
        hint="Log your first session to see it here."
        action={
          <Link to="/app/workout-logs" className="btn btn-primary btn-sm">
            Log Workout
          </Link>
        }
      />
    );
  }

  return (
    <ListGroup variant="flush">
      {workouts.map((log) => (
        <ListGroup.Item
          key={log.id}
          className="d-flex justify-content-between align-items-center px-4 py-3"
        >
          <div>
            <p className="mb-0 fw-semibold">{log.plan_name ?? 'Free Session'}</p>
            <small className="text-muted">{formatDate(log.performed_at)}</small>
          </div>
          <Badge bg="secondary">{log.exercise_count} exercises</Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
