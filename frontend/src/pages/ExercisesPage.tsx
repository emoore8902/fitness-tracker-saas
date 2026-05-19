import { useEffect, useState, useCallback, useMemo } from 'react';
import {Form, InputGroup, Table, Badge, Row, Col } from 'react-bootstrap';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getExercises } from '../api/exercisesApi';
import type { Exercise } from '../types';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setExercises(await getExercises());
    } catch {
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadExercises(); }, [loadExercises]);

  // Derive unique filter options from loaded data
  const categories = useMemo(
    () => [...new Set(exercises.map((e) => e.category?.name).filter(Boolean))].sort(),
    [exercises]
  );
  const equipmentOptions = useMemo(
    () => [...new Set(exercises.map((e) => e.equipment).filter(Boolean))].sort(),
    [exercises]
  );

  const filtered = exercises.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || ex.category?.name === categoryFilter;
    const matchEquipment = !equipmentFilter || ex.equipment === equipmentFilter;
    return matchSearch && matchCategory && matchEquipment;
  });

  return (
    <>
      <div className="mb-4">
        <h2 className="mb-0">Exercise Library</h2>
        <p className="text-muted small mb-0">Browse all available exercises</p>
      </div>

      <Row className="g-2 mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search exercises…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
          >
            <option value="">All Equipment</option>
            {equipmentOptions.map((eq) => (
              <option key={eq} value={eq as string}>{eq}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading && <LoadingState message="Loading exercises…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadExercises} />}

      {!loading && !error && exercises.length === 0 && (
        <EmptyState
          icon="🏋️"
          message="No exercises in the library yet"
          hint="An admin can add global exercises from the Admin panel."
        />
      )}

      {!loading && !error && exercises.length > 0 && filtered.length === 0 && (
        <EmptyState icon="🔍" message="No exercises match your filters" hint="Try adjusting your search or filter." />
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((ex) => (
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
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
