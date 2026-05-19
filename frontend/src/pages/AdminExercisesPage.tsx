import { useEffect, useState, useCallback } from 'react';
import { Table, Badge, Button, Modal, Form, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  getAdminExercises, createAdminExercise, updateAdminExercise, deleteAdminExercise,
  getAdminCategories,
  type AdminExercisePayload,
  type CategoryWithCount,
} from '../api/adminApi';
import type { Exercise } from '../types';

// ─── Exercise Modal ────────────────────────────────────────────────────────────

interface ExerciseModalProps {
  show: boolean;
  onHide: () => void;
  onSaved: (ex: Exercise) => void;
  editing: Exercise | null;
  categories: CategoryWithCount[];
}

const EMPTY_FORM: AdminExercisePayload = {
  name: '',
  exercise_category_id: 0,
  muscle_group: '',
  equipment: '',
  instructions: '',
};

function ExerciseModal({ show, onHide, onSaved, editing, categories }: ExerciseModalProps) {
  const [form, setForm] = useState<AdminExercisePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        exercise_category_id: editing.exercise_category_id ?? 0,
        muscle_group: editing.muscle_group ?? '',
        equipment: editing.equipment ?? '',
        instructions: editing.instructions ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [editing, show]);

  function set(field: keyof AdminExercisePayload, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Exercise name is required.');
      return;
    }
    if (!form.exercise_category_id) {
      setError('Please select a category.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: AdminExercisePayload = {
        name: form.name.trim(),
        exercise_category_id: form.exercise_category_id,
        muscle_group: form.muscle_group.trim(),
        equipment: form.equipment.trim(),
        instructions: form.instructions.trim(),
      };
      const saved = editing
        ? await updateAdminExercise(editing.id, payload)
        : await createAdminExercise(payload);
      onSaved(saved);
    } catch {
      setError('Failed to save exercise. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editing ? 'Edit Exercise' : 'New Exercise'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>
        )}
        <Row className="g-3">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Bench Press"
                autoFocus
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.exercise_category_id}
                onChange={(e) => set('exercise_category_id', Number(e.target.value))}
              >
                <option value={0}>— Select —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Muscle Group</Form.Label>
              <Form.Control
                value={form.muscle_group}
                onChange={(e) => set('muscle_group', e.target.value)}
                placeholder="e.g. Pectorals"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Equipment</Form.Label>
              <Form.Control
                value={form.equipment}
                onChange={(e) => set('equipment', e.target.value)}
                placeholder="e.g. Barbell"
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.instructions}
                onChange={(e) => set('instructions', e.target.value)}
                placeholder="Step-by-step instructions…"
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [exData, catData] = await Promise.all([getAdminExercises(), getAdminCategories()]);
      setExercises(exData);
      setCategories(catData);
    } catch {
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }

  function openEdit(ex: Exercise) {
    setEditing(ex);
    setShowModal(true);
  }

  function handleSaved(saved: Exercise) {
    setExercises((prev) => {
      const exists = prev.find((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [...prev, saved];
    });
    setShowModal(false);
  }

  async function handleDelete(id: number) {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAdminExercise(id);
      setExercises((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    } catch {
      setDeleteError('Failed to delete exercise. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Global Exercises</h2>
          <p className="text-muted small mb-0">Platform-wide exercise library</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Add Exercise</Button>
      </div>

      {deleteError && (
        <Alert variant="danger" dismissible onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search exercises…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {loading && <LoadingState message="Loading exercises…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && exercises.length === 0 && (
        <EmptyState
          icon="🏋️"
          message="No exercises yet"
          hint="Add your first global exercise to populate the library."
          action={<Button variant="primary" onClick={openCreate}>+ Add Exercise</Button>}
        />
      )}

      {!loading && !error && exercises.length > 0 && filtered.length === 0 && (
        <EmptyState icon="🔍" message="No exercises match your search" />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="table-responsive">
          <Table hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Exercise</th>
                <th>Category</th>
                <th>Muscle Group</th>
                <th>Equipment</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ex) => {
                const isConfirming = deleteConfirmId === ex.id;
                return (
                  <tr key={ex.id}>
                    <td className="fw-semibold">{ex.name}</td>
                    <td>
                      {ex.category
                        ? <Badge bg="secondary">{ex.category.name}</Badge>
                        : <span className="text-muted">—</span>
                      }
                    </td>
                    <td>{ex.muscle_group ?? <span className="text-muted">—</span>}</td>
                    <td>{ex.equipment ?? <span className="text-muted">—</span>}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEdit(ex)}
                        >
                          Edit
                        </Button>

                        {isConfirming ? (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deleting}
                              onClick={() => handleDelete(ex.id)}
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
                            onClick={() => setDeleteConfirmId(ex.id)}
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

      <ExerciseModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
        categories={categories}
      />
    </>
  );
}
