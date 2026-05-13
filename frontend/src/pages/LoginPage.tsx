import { Container, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '100%', maxWidth: 420 }} className="p-4 shadow-sm">
        <h4 className="mb-4 text-center fw-bold">Sign In</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="you@example.com" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="••••••••" />
          </Form.Group>
          {/* TODO: Wire up to AuthContext.login() and POST /api/login */}
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0 small">
          No account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </Container>
  );
}
