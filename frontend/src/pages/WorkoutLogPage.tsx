import { useState } from 'react';
import { Card, Form, Button, Row, Col, Table } from 'react-bootstrap';

// TODO: Replace with real exercise search from GET /api/exercises
const mockExerciseRows = [
  { id: 1, name: 'Bench Press' },
  { id: 2, name: 'Incline Dumbbell Press' },
  { id: 3, name: 'Cable Fly' },
];

export default function WorkoutLogPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Log Workout</h2>
      </div>

      <Row className="g-4">
        {/* Session Details */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Session Details</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Workout Plan</Form.Label>
                <Form.Select>
                  <option value="">— No Plan (Free Session) —</option>
                  <option>Push / Pull / Legs</option>
                  <option>Starting Strength</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="How did the session feel?"
                />
              </Form.Group>
              {/* TODO: POST /api/workout-logs */}
              <Button variant="success" className="w-100">
                ✓ Save Workout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Exercise Log */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Exercises</span>
              <Button variant="outline-primary" size="sm">+ Add Exercise</Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0" responsive>
                <thead className="table-light">
                  <tr>
                    <th>Exercise</th>
                    <th style={{ width: 80 }}>Sets</th>
                    <th style={{ width: 80 }}>Reps</th>
                    <th style={{ width: 100 }}>Weight (kg)</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {mockExerciseRows.map((ex) => (
                    <tr key={ex.id}>
                      <td className="align-middle fw-semibold">{ex.name}</td>
                      <td>
                        <Form.Control type="number" placeholder="3" size="sm" min={1} />
                      </td>
                      <td>
                        <Form.Control type="number" placeholder="8" size="sm" min={1} />
                      </td>
                      <td>
                        <Form.Control type="number" placeholder="60" size="sm" min={0} step={2.5} />
                      </td>
                      <td className="align-middle text-center">
                        <Button variant="link" className="text-danger p-0 lh-1">✕</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
