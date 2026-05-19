import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getWorkoutLogs, getWorkoutLog, deleteWorkoutLog } from '../api/workoutLogsApi';
import type { WorkoutLog } from '../types';

// ─── Detail Modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  logId: number | null;
  onHide: () => void;
}

function DetailModal({ logId, onHide }: DetailModalProps) {
  const { user } = useAuth();
  // NOTE: Weights are stored as raw numbers; weight_unit is a display label only.
  const unit = user?.weight_unit ?? 'lbs';
  const [log, setLog] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!logId) return;
    setLog(null);
    setLoading(true);
    getWorkoutLog(logId)
      .then(setLog)
      .catch(() => setLog(null))
      .finally(() => setLoading(false));
  }, [logId]);

  const dateStr = log?.performed_at
    ? new Date(log.performed_at).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <Modal show={!!logId} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Workout Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p className="text-muted text-center py-3">Loading…</p>}
        {!loading && !log && <p className="text-danger text-center py-3">Failed to load session.</p>}
        {!loading && log && (
          <>
            <div className="mb-3">
              <p className="mb-1"><strong>Date:</strong> {dateStr}</p>
              <p className="mb-1">
                <strong>Plan:</strong>{' '}
                {log.plan?.name ?? <span className="text-muted">Free session</span>}
              </p>
              {log.notes && (
                <p className="mb-0"><strong>Notes:</strong> {log.notes}</p>
              )}
            </div>

            {log.exercises && log.exercises.length > 0 ? (
              <div className="table-responsive">
                <Table size="sm" className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Exercise</th>
                      <th style={{ width: 60 }}>Sets</th>
                      <th style={{ width: 60 }}>Reps</th>
                      <th style={{ width: 90 }}>{`Weight (${unit})`}</th>
                      <th style={{ width: 80 }}>Dur. (min)</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.exercises.map((ex) => (
                      <tr key={ex.id}>
                        <td className="fw-semibold">{ex.exercise?.name ?? `Exercise #${ex.exercise_id}`}</td>
                        <td>{ex.sets ?? '—'}</td>
                        <td>{ex.reps ?? '—'}</td>
                        <td>{ex.weight != null ? `${ex.weight} ${unit}` : '—'}</td>
                        <td>{ex.duration_minutes != null ? `${ex.duration_minutes} min` : '—'}</td>
                        <td className="text-muted">{ex.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-muted text-center py-2">No exercises recorded for this session.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkoutHistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewingLogId, setViewingLogId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkoutLogs();
      setLogs(data);
    } catch {
      setError('Failed to load workout history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  async function handleDelete(id: number) {
    setDeleting(true);
    try {
      await deleteWorkoutLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // Keep UI intact — user can retry
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Workout History</h2>
        <Link to="/app/workout-logs" className="btn btn-primary">
          + Log Workout
        </Link>
      </div>

      {loading && <LoadingState message="Loading your workout history…" />}

      {!loading && error && <ErrorState message={error} onRetry={loadLogs} />}

      {!loading && !error && logs.length === 0 && (
        <EmptyState
          icon="📅"
          message="No workout history yet"
          hint="Log your first workout to see it here."
          action={
            <Link to="/app/workout-logs" className="btn btn-primary">
              + Log Workout
            </Link>
          }
        />
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="table-responsive">
          <Table hover className="bg-white shadow-sm rounded align-middle">
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
              {logs.map((log) => {
                const isConfirmingDelete = deleteConfirmId === log.id;
                const exerciseCount = log.exercises?.length ?? 0;
                const dateLabel = new Date(log.performed_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                });

                return (
                  <tr key={log.id}>
                    <td className="fw-semibold">{dateLabel}</td>
                    <td>{log.plan?.name ?? <span className="text-muted">Free session</span>}</td>
                    <td>
                      <Badge bg="secondary">{exerciseCount}</Badge>
                    </td>
                    <td className="text-muted" style={{ maxWidth: 200 }}>
                      <span
                        title={log.notes ?? ''}
                        style={{
                          overflow: 'hidden', display: 'block',
                          whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}
                      >
                        {log.notes || '—'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setViewingLogId(log.id)}
                        >
                          View
                        </Button>

                        {isConfirmingDelete ? (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deleting}
                              onClick={() => handleDelete(log.id)}
                            >
                              {deleting ? '…' : 'Confirm'}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteConfirmId(log.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <DetailModal
        logId={viewingLogId}
        onHide={() => setViewingLogId(null)}
      />
    </>
  );
}
