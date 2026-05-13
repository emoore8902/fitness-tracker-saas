import { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup, Row, Col } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/exercises (global only, user_id = null)
const placeholderExercises = [
  { id: 1, name: 'Bench Press', category: 'Chest', muscle: 'Pectorals', equipment: 'Barbell' },
  { id: 2, name: 'Barbell Squat', category: 'Legs', muscle: 'Quadriceps', equipment: 'Barbell' },
  { id: 3, name: 'Deadlift', category: 'Back', muscle: 'Hamstrings', equipment: 'Barbell' },
  { id: 4, name: 'Pull-Up', category: 'Back', muscle: 'Latissimus Dorsi', equipment: 'Bodyweight' },
  { id: 5, name: 'Overhead Press', category: 'Shoulders', muscle: 'Deltoids', equipment: 'Barbell' },
];

export default function AdminExercisesPage() {
  const [search, setSearch] = useState('');
  const exercises = placeholderExercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Global Exercises</h2>
        <Button variant="primary">+ Add Exercise</Button>
      </div>

      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
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
        <EmptyState icon="🏋️" message="No exercises found" />
      )}
    </>
  );
}
