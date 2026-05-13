import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <h2 className="mb-4">Profile & Settings</h2>
      <Row className="g-4">
        {/* Personal Info */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Personal Information</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" defaultValue={user?.name ?? ''} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" defaultValue={user?.email ?? ''} />
                </Form.Group>
                {/* TODO: PATCH /api/profile */}
                <Button variant="primary">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Change Password */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Change Password</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" />
                </Form.Group>
                {/* TODO: POST /api/change-password */}
                <Button variant="outline-primary">Update Password</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
