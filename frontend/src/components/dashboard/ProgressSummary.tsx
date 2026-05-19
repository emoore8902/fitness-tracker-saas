import { Card, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import type { ExerciseProgress } from '../../types';

interface Props {
  workoutsThisWeek: number;
  weeklyGoal: number;
  progress: ExerciseProgress | null;
}

export default function ProgressSummary({ workoutsThisWeek, weeklyGoal, progress }: Props) {
  const { user } = useAuth();
  // NOTE: Weights are stored as raw numbers; weight_unit is a display label only.
  const unit = user?.weight_unit ?? 'lbs';

  const progressPct = Math.min(Math.round((workoutsThisWeek / weeklyGoal) * 100), 100);
  const goalMet = workoutsThisWeek >= weeklyGoal;

  const changeColor =
    progress === null ? ''
    : progress.change > 0 ? 'text-success'
    : progress.change < 0 ? 'text-danger'
    : 'text-muted';

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white fw-semibold">Weekly Goal</Card.Header>
      <Card.Body>
        <ProgressBar
          now={progressPct}
          variant={goalMet ? 'success' : 'primary'}
          className="mb-2"
          style={{ height: 10 }}
        />
        <small className="text-muted">
          {goalMet
            ? `Goal reached! ${workoutsThisWeek} of ${weeklyGoal} sessions this week`
            : `${workoutsThisWeek} of ${weeklyGoal} sessions this week`}
        </small>
      </Card.Body>

      {progress && (
        <>
          <hr className="my-0" />
          <Card.Header className="bg-white fw-semibold">Strength Progress</Card.Header>
          <Card.Body>
            <div className="fw-semibold mb-1">{progress.exercise}</div>
            <div className="mb-1">
              {progress.starting_weight} {unit} &rarr; {progress.latest_weight} {unit}
            </div>
            <small className={changeColor}>{progress.change_label}</small>
          </Card.Body>
        </>
      )}
    </Card>
  );
}
