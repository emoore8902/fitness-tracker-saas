import { useState } from 'react';
import { Button, Form, InputGroup, Table, Badge, Row, Col } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/exercises
const placeholderExercises = [
  { id: 1, name: 'Bench Press', category: 'Chest', muscle: 'Pectorals', equipment: 'Barbell' },
  { id: 2, name: 'Barbell Squat', category: 'Legs', muscle: 'Quadriceps', equipment: 'Barbell' },
  { id: 3, name: 'Pull-Up', category: 'Back', muscle: 'Latissimus Dorsi', equipment: 'Bodyweight' },
  { id: 4, name: 'Overhead Press', category: 'Shoulders', muscle: 'Deltoids', equipment: 'Barbell' },
  { id: 5, name: 'Deadlift', category: 'Back', muscle: 'Hamstrings', equipment: 'Barbell' },
];

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const exercises = placeholderExercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Exercise Library</h2>
        <Button variant="primary">+ Add Exercise</Button>
      </div>

      {/* Filters */}
      <Row className="g-2 mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select>
            <option value="">All Categories</option>
            <option>Chest</option>
            <option>Back</option>
            <option>Legs</option>
            <option>Shoulders</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select>
            <option value="">All Equipment</option>
            <option>Barbell</option>
            <option>Dumbbell</option>
            <option>Bodyweight</option>
            <option>Machine</option>
          </Form.Select>
        </Col>
      </Row>

      {exercises.length > 0 ? (
        <Table responsive hover className="bg-white shadow-sm rounded">
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
            {exercises.map((ex) => (
              <tr key={ex.id}>
                <td className="fw-semibold">{ex.name}</td>
                <td><Badge bg="secondary">{ex.category}</Badge></td>
                <td>{ex.muscle}</td>
                <td>{ex.equipment}</td>
                <td className="text-end">
                  <Button variant="outline-primary" size="sm" className="me-1">Edit</Button>
                  <Button variant="outline-danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          icon="🏋️"
          message="No exercises found"
          hint="Try a different search term or add a new exercise."
          action={<Button variant="primary">+ Add Exercise</Button>}
        />
      )}
    </>
  );
}
