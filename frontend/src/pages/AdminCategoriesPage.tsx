import { useEffect, useState, useCallback } from 'react';
import { Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import {
  getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory,
  type CategoryWithCount,
} from '../api/adminApi';

// ─── Category Modal ───────────────────────────────────────────────────────────

interface CategoryModalProps {
  show: boolean;
  onHide: () => void;
  onSaved: (cat: CategoryWithCount) => void;
  editing: CategoryWithCount | null;
}

function CategoryModal({ show, onHide, onSaved, editing }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(editing?.name ?? '');
    setError(null);
  }, [editing, show]);

  async function handleSave() {
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = editing
        ? await updateAdminCategory(editing.id, { name: name.trim() })
        : await createAdminCategory({ name: name.trim() });
      onSaved(saved);
    } catch {
      setError('Failed to save category. The name may already exist.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editing ? 'Edit Category' : 'New Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>
        )}
        <Form.Group>
          <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Core, Cardio, Mobility"
            autoFocus
          />
        </Form.Group>
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CategoryWithCount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getAdminCategories());
    } catch {
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  function openCreate() {
    setEditing(null);
    setShowModal(true);
  }

  function openEdit(cat: CategoryWithCount) {
    setEditing(cat);
    setShowModal(true);
  }

  function handleSaved(saved: CategoryWithCount) {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved];
    });
    setShowModal(false);
  }

  async function handleDelete(id: number) {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAdminCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setDeleteError(msg ?? 'Cannot delete this category. It may still have exercises.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Exercise Categories</h2>
          <p className="text-muted small mb-0">Platform-wide exercise groupings</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Add Category</Button>
      </div>

      {deleteError && (
        <Alert variant="danger" dismissible onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      {loading && <LoadingState message="Loading categories…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadCategories} />}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          icon="🏷️"
          message="No categories yet"
          hint="Add your first exercise category to get started."
          action={<Button variant="primary" onClick={openCreate}>+ Add Category</Button>}
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="table-responsive">
          <Table hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Exercises</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isConfirming = deleteConfirmId === cat.id;
                return (
                  <tr key={cat.id}>
                    <td className="fw-semibold">{cat.name}</td>
                    <td>
                      <Badge bg="secondary">{cat.exercises_count}</Badge>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEdit(cat)}
                        >
                          Edit
                        </Button>

                        {isConfirming ? (
                          <>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deleting}
                              onClick={() => handleDelete(cat.id)}
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
                            onClick={() => setDeleteConfirmId(cat.id)}
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

      <CategoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
      />
    </>
  );
}
