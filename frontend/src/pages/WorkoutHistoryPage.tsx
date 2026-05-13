import { Table, Badge, Button } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/workout-logs
const placeholderLogs = [
  { id: 1, date: '2026-05-13', plan: 'Push / Pull / Legs', exercises: 5, notes: 'Felt strong today.' },
  { id: 2, date: '2026-05-11', plan: 'Starting Strength', exercises: 3, notes: '' },
  { id: 3, date: '2026-05-09', plan: 'Push / Pull / Legs', exercises: 5, notes: '' },
];

export default function WorkoutHistoryPage() {
  const logs = placeholderLogs;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Workout History</h2>
      </div>

      {logs.length > 0 ? (
        <Table responsive hover className="bg-white shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Plan</th>
              <th>Exercises</th>
              <th>Notes</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td className="fw-semibold">{log.plan}</td>
                <td><Badge bg="secondary">{log.exercises}</Badge></td>
                <td className="text-muted">{log.notes || '—'}</td>
                <td className="text-end">
                  <Button variant="outline-secondary" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          icon="📅"
          message="No workout history yet"
          hint="Log your first workout to see it here."
        />
      )}
    </>
  );
}
