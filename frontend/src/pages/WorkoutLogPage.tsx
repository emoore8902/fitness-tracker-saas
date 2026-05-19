import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getExercises } from '../api/exercisesApi';
import { getWorkoutPlans } from '../api/workoutPlansApi';
import { createWorkoutLog } from '../api/workoutLogsApi';
import SearchableExerciseSelect from '../components/forms/SearchableExerciseSelect';
import type {
  Exercise, WorkoutPlan, CreateWorkoutLogPayload, WorkoutLogExercisePayload,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function emptyExerciseRow(): WorkoutLogExercisePayload {
  return { exercise_id: 0, sets: '', reps: '', weight: '', duration_minutes: '', notes: '' };
}

// Returns true if any row has meaningful user-entered data worth protecting.
function rowsHaveData(rows: WorkoutLogExercisePayload[]): boolean {
  return rows.some(
    (r) => r.exercise_id !== 0 || r.sets !== '' || r.reps !== '' || r.weight !== '',
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkoutLogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // NOTE: Weights are stored as raw numbers; weight_unit is a display label only.
  // A full conversion system can be added later if needed.
  const unit = user?.weight_unit ?? 'lbs';

  // Dropdown data
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [performedAt, setPerformedAt] = useState(todayISO());
  const [planId, setPlanId] = useState<number | ''>('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [rows, setRows] = useState<WorkoutLogExercisePayload[]>([emptyExerciseRow()]);

  // Save state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDropdowns = useCallback(async () => {
    try {
      const [exData, planData] = await Promise.all([getExercises(), getWorkoutPlans()]);
      setExercises(exData);
      setPlans(planData);
    } catch {
      // Non-fatal: dropdowns just stay empty, user can still type
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { loadDropdowns(); }, [loadDropdowns]);

  // ─── Row helpers ───────────────────────────────────────────────────────────

  function addRow() {
    setRows((prev) => [...prev, emptyExerciseRow()]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(
    index: number,
    field: keyof WorkoutLogExercisePayload,
    value: string | number,
  ) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  // ─── Plan selection ────────────────────────────────────────────────────────

  function handlePlanChange(value: string) {
    const newPlanId = value === '' ? ('' as const) : Number(value);

    // Clearing the plan: just deselect — never auto-clear exercise rows.
    if (newPlanId === '') {
      setPlanId('');
      return;
    }

    const selected = plans.find((p) => p.id === newPlanId);

    // Plan has no exercises: just update the association.
    if (!selected?.exercises?.length) {
      setPlanId(newPlanId);
      return;
    }

    // If the user has already entered data, ask before overwriting.
    if (rowsHaveData(rows)) {
      const confirmed = window.confirm(
        'Replace the current exercise list with exercises from this plan?',
      );
      if (!confirmed) return;
    }

    setPlanId(newPlanId);
    const newRows = [...selected.exercises]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((pe) => ({
        exercise_id:      pe.exercise_id,
        sets:             pe.sets          ?? '',
        reps:             pe.reps          ?? '',
        weight:           '',
        duration_minutes: '' as const,
        notes:            '',
      }));
    setRows(newRows.length > 0 ? newRows : [emptyExerciseRow()]);
  }

  // ─── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    setError(null);

    if (rows.length === 0) {
      setError('Add at least one exercise before saving.');
      return;
    }
    const invalidRow = rows.findIndex((r) => !r.exercise_id);
    if (invalidRow !== -1) {
      setError(`Select an exercise for row ${invalidRow + 1}.`);
      return;
    }

    setSaving(true);
    try {
      const payload: CreateWorkoutLogPayload = {
        workout_plan_id: planId,
        performed_at: performedAt,
        notes: sessionNotes,
        exercises: rows,
      };
      await createWorkoutLog(payload);
      navigate('/app/history');
    } catch {
      setError('Failed to save your workout. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Log Workout</h2>
          <p className="text-muted small mb-0">Record your session performance</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* ── Session Details ── */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Session Details</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={performedAt}
                  onChange={(e) => setPerformedAt(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Workout Plan</Form.Label>
                <Form.Select
                  value={planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  disabled={loadingData}
                >
                  <option value="">— No Plan (Free Session) —</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Selecting a plan will pre-fill exercises from that plan.
                  You can remove skipped exercises or add extra ones.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Session Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="How did the session feel? Any PRs?"
                />
              </Form.Group>

              <Button
                variant="success"
                className="w-100"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : '✓ Save Workout'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Exercise Log ── */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Exercises</span>
              <Button variant="outline-primary" size="sm" onClick={addRow}>
                + Add Exercise
              </Button>
            </Card.Header>

            {rows.length === 0 ? (
              <Card.Body className="text-center text-muted py-5">
                <p className="mb-2">No exercises added yet.</p>
                <Button variant="outline-primary" size="sm" onClick={addRow}>
                  + Add First Exercise
                </Button>
              </Card.Body>
            ) : (
              <div className="table-responsive">
                <Table className="mb-0 align-middle" size="sm">
                  <thead className="table-light">
                    <tr>
                      <th>Exercise</th>
                      <th style={{ width: 70 }}>Sets</th>
                      <th style={{ width: 70 }}>Reps</th>
                      <th style={{ width: 90 }}>{`Weight (${unit})`}</th>
                      <th style={{ width: 80 }}>Dur. (min)</th>
                      <th>Notes</th>
                      <th style={{ width: 40 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td style={{ minWidth: 220 }}>
                          <SearchableExerciseSelect
                            exercises={exercises}
                            value={row.exercise_id}
                            onChange={(id) => updateRow(i, 'exercise_id', id)}
                            disabled={loadingData}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            min={1}
                            value={row.sets}
                            onChange={(e) =>
                              updateRow(i, 'sets', e.target.value === '' ? '' : Number(e.target.value))
                            }
                            placeholder="—"
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            min={1}
                            value={row.reps}
                            onChange={(e) =>
                              updateRow(i, 'reps', e.target.value === '' ? '' : Number(e.target.value))
                            }
                            placeholder="—"
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            min={0}
                            step={0.5}
                            value={row.weight}
                            onChange={(e) =>
                              updateRow(i, 'weight', e.target.value === '' ? '' : Number(e.target.value))
                            }
                            placeholder="—"
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            min={0}
                            value={row.duration_minutes}
                            onChange={(e) =>
                              updateRow(
                                i,
                                'duration_minutes',
                                e.target.value === '' ? '' : Number(e.target.value),
                              )
                            }
                            placeholder="—"
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            value={row.notes}
                            onChange={(e) => updateRow(i, 'notes', e.target.value)}
                            placeholder="Optional"
                          />
                        </td>
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                            onClick={() => removeRow(i)}
                            title="Remove"
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
