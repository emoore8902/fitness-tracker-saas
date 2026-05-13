import { Container, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '100%', maxWidth: 420 }} className="p-4 shadow-sm">
        <h4 className="mb-4 text-center fw-bold">Create Account</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your Name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="you@example.com" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="••••••••" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="••••••••" />
          </Form.Group>
          {/* TODO: Wire up to POST /api/register */}
          <Button variant="success" type="submit" className="w-100">
            Register
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0 small">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </Container>
  );
}
