import { useEffect, useState, useCallback } from 'react';
import {
  Row, Col, Card, Badge, Button, Modal, Form, Table, Alert,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import SearchableExerciseSelect from '../components/forms/SearchableExerciseSelect';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getWorkoutPlans, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } from '../api/workoutPlansApi';
import { getExercises } from '../api/exercisesApi';
import type {
  WorkoutPlan, Exercise, CreateWorkoutPlanPayload, WorkoutPlanExercisePayload,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GOAL_VARIANTS: Record<string, string> = {
  Hypertrophy: 'success',
  Strength: 'primary',
  Endurance: 'warning',
  'General Fitness': 'info',
  'Fat Loss': 'danger',
};

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function emptyPayload(): CreateWorkoutPlanPayload {
  return { name: '', description: '', goal: '', days_per_week: '', exercises: [] };
}

function emptyExerciseRow(index: number): WorkoutPlanExercisePayload {
  return { exercise_id: 0, day_of_week: 'Mon', sets: '', reps: '', target_weight: '', sort_order: index };
}

// ─── Plan Modal ───────────────────────────────────────────────────────────────

interface PlanModalProps {
  show: boolean;
  onHide: () => void;
  onSaved: (plan: WorkoutPlan) => void;
  editingPlan: WorkoutPlan | null;
  exercises: Exercise[];
}

function PlanModal({ show, onHide, onSaved, editingPlan, exercises }: PlanModalProps) {
  const { user } = useAuth();
  // NOTE: Weights are stored as raw numbers; weight_unit is a display label only.
  const unit = user?.weight_unit ?? 'lbs';
  const [form, setForm] = useState<CreateWorkoutPlanPayload>(emptyPayload());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlan) {
      setForm({
        name: editingPlan.name,
        description: editingPlan.description ?? '',
        goal: editingPlan.goal ?? '',
        days_per_week: editingPlan.days_per_week ?? '',
        exercises: (editingPlan.exercises ?? []).map((ex, i) => ({
          exercise_id: ex.exercise_id,
          day_of_week: ex.day_of_week ?? 'Mon',
          sets: ex.sets ?? '',
          reps: ex.reps ?? '',
          target_weight: ex.target_weight ?? '',
          sort_order: ex.sort_order ?? i,
        })),
      });
    } else {
      setForm(emptyPayload());
    }
    setError(null);
  }, [editingPlan, show]);

  function updateField<K extends keyof CreateWorkoutPlanPayload>(
    key: K,
    value: CreateWorkoutPlanPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addExerciseRow() {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, emptyExerciseRow(prev.exercises.length)],
    }));
  }

  function removeExerciseRow(index: number) {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  }

  function updateExerciseRow(
    index: number,
    field: keyof WorkoutPlanExercisePayload,
    value: string | number,
  ) {
    setForm((prev) => {
      const rows = [...prev.exercises];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, exercises: rows };
    });
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Plan name is required.');
      return;
    }
    const invalidRow = form.exercises.findIndex((ex) => !ex.exercise_id);
    if (invalidRow !== -1) {
      setError(`Exercise on row ${invalidRow + 1} is not selected.`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: CreateWorkoutPlanPayload = {
        ...form,
        exercises: form.exercises.map((ex, i) => ({ ...ex, sort_order: i })),
      };
      const saved = editingPlan
        ? await updateWorkoutPlan(editingPlan.id, payload)
        : await createWorkoutPlan(payload);
      onSaved(saved);
    } catch {
      setError('Failed to save workout plan. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{editingPlan ? 'Edit Workout Plan' : 'New Workout Plan'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Row className="g-3 mb-4">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Plan Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Push / Pull / Legs"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Days / Week</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={7}
                value={form.days_per_week}
                onChange={(e) =>
                  updateField('days_per_week', e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="e.g. 3"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Goal</Form.Label>
              <Form.Control
                value={form.goal}
                onChange={(e) => updateField('goal', e.target.value)}
                placeholder="e.g. Hypertrophy, Strength, Fat Loss"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Optional notes about this plan"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Exercises</h6>
          <Button variant="outline-primary" size="sm" onClick={addExerciseRow}>
            + Add Exercise
          </Button>
        </div>

        {form.exercises.length === 0 ? (
          <p className="text-muted small text-center py-3 border rounded bg-light">
            No exercises added yet. Click "+ Add Exercise" to build your plan.
          </p>
        ) : (
          <div className="table-responsive">
            <Table size="sm" className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Exercise</th>
                  <th style={{ width: 80 }}>Day</th>
                  <th style={{ width: 70 }}>Sets</th>
                  <th style={{ width: 70 }}>Reps</th>
                  <th style={{ width: 90 }}>{`Target (${unit})`}</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {form.exercises.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <SearchableExerciseSelect
                        exercises={exercises}
                        value={row.exercise_id}
                        onChange={(id) => updateExerciseRow(i, 'exercise_id', id)}
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={row.day_of_week}
                        onChange={(e) => updateExerciseRow(i, 'day_of_week', e.target.value)}
                      >
                        {DAYS_OF_WEEK.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={1}
                        value={row.sets}
                        onChange={(e) =>
                          updateExerciseRow(i, 'sets', e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="3"
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={1}
                        value={row.reps}
                        onChange={(e) =>
                          updateExerciseRow(i, 'reps', e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="10"
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={0}
                        step={0.5}
                        value={row.target_weight}
                        onChange={(e) =>
                          updateExerciseRow(
                            i,
                            'target_weight',
                            e.target.value === '' ? '' : Number(e.target.value),
                          )
                        }
                        placeholder="—"
                      />
                    </td>
                    <td>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => removeExerciseRow(i)}
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
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editingPlan ? 'Save Changes' : 'Create Plan'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansData, exercisesData] = await Promise.all([
        getWorkoutPlans(),
        getExercises(),
      ]);
      setPlans(plansData);
      setExercises(exercisesData);
    } catch {
      setError('Failed to load workout plans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function openCreate() {
    setEditingPlan(null);
    setShowModal(true);
  }

  function openEdit(plan: WorkoutPlan) {
    setEditingPlan(plan);
    setShowModal(true);
  }

  function handleSaved(saved: WorkoutPlan) {
    setPlans((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
    setShowModal(false);
  }

  async function handleDelete(id: number) {
    setDeleting(true);
    try {
      await deleteWorkoutPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
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
        <h2 className="mb-0">Workout Plans</h2>
        <Button variant="primary" onClick={openCreate}>+ New Plan</Button>
      </div>

      {loading && <LoadingState message="Loading your workout plans…" />}

      {!loading && error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && plans.length === 0 && (
        <EmptyState
          icon="📋"
          message="No workout plans yet"
          hint="Create your first plan to organise your training."
          action={<Button variant="primary" onClick={openCreate}>+ New Plan</Button>}
        />
      )}

      {!loading && !error && plans.length > 0 && (
        <Row className="g-4">
          {plans.map((plan) => {
            const isConfirmingDelete = deleteConfirmId === plan.id;
            const exerciseCount = plan.exercises?.length ?? 0;

            return (
              <Col key={plan.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0 me-2" style={{ wordBreak: 'break-word' }}>
                        {plan.name}
                      </Card.Title>
                      {plan.goal && (
                        <Badge bg={GOAL_VARIANTS[plan.goal] ?? 'secondary'} className="flex-shrink-0">
                          {plan.goal}
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted small mb-1">
                      {plan.days_per_week ? `${plan.days_per_week} days/week` : 'Frequency not set'}
                      {' · '}
                      {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                    </p>

                    {plan.description && (
                      <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                        {plan.description}
                      </p>
                    )}
                  </Card.Body>

                  <Card.Footer className="bg-white border-top-0 pt-0 d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => openEdit(plan)}
                    >
                      Edit
                    </Button>

                    {isConfirmingDelete ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deleting}
                          onClick={() => handleDelete(plan.id)}
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
                        onClick={() => setDeleteConfirmId(plan.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <PlanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editingPlan={editingPlan}
        exercises={exercises}
      />
    </>
  );
}
