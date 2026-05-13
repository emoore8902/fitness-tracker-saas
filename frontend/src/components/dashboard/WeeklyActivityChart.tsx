import { Card } from 'react-bootstrap';
import type { WeeklyActivityDay } from '../../types';

interface Props {
  activity: WeeklyActivityDay[];
}

export default function WeeklyActivityChart({ activity }: Props) {
  const maxWorkouts = Math.max(...activity.map((d) => d.workouts), 1);

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white fw-semibold">Weekly Activity</Card.Header>
      <Card.Body>
        <div className="d-flex align-items-end justify-content-between gap-1" style={{ height: 80 }}>
          {activity.map((entry) => {
            const heightPct = Math.round((entry.workouts / maxWorkouts) * 100);
            const hasActivity = entry.workouts > 0;
            return (
              <div key={entry.day} className="d-flex flex-column align-items-center flex-grow-1">
                <div
                  title={`${entry.workouts} workout${entry.workouts !== 1 ? 's' : ''}`}
                  style={{
                    height: hasActivity ? `${heightPct}%` : 4,
                    minHeight: 4,
                    background: hasActivity ? '#0d6efd' : '#e9ecef',
                    borderRadius: 4,
                    width: '100%',
                    transition: 'height 0.3s ease',
                  }}
                />
                <small className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                  {entry.day}
                </small>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}
