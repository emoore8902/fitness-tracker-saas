import { Card, ProgressBar } from 'react-bootstrap';

// TODO: Make weeklyGoal user-configurable once a profile/settings endpoint exists
const WEEKLY_GOAL = 3;

interface Props {
  workoutsThisWeek: number;
}

export default function ProgressSummary({ workoutsThisWeek }: Props) {
  const progressPct = Math.min(Math.round((workoutsThisWeek / WEEKLY_GOAL) * 100), 100);
  const goalMet = workoutsThisWeek >= WEEKLY_GOAL;

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
            ? `Goal reached! ${workoutsThisWeek} of ${WEEKLY_GOAL} sessions this week`
            : `${workoutsThisWeek} of ${WEEKLY_GOAL} sessions this week`}
        </small>
      </Card.Body>
    </Card>
  );
}
