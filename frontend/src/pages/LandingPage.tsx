import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🏋️',
    title: 'Exercise Library',
    text: 'Browse hundreds of exercises organized by muscle group and equipment.',
  },
  {
    icon: '📋',
    title: 'Custom Workout Plans',
    text: 'Build structured weekly plans tailored to your goals.',
  },
  {
    icon: '📈',
    title: 'Track Your Progress',
    text: 'Log every session and watch your strength improve over time.',
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3">
        <span className="navbar-brand fw-bold fs-5">💪 FitTracker</span>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-dark text-white py-5">
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold mb-3">Train Smarter.</h1>
          <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: 560 }}>
            Plan your workouts, track your lifts, and measure your progress —
            all in one place.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg px-4">
              Start for Free
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              Sign In
            </Link>
          </div>
        </Container>
      </div>

      {/* Features */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">Everything you need</h2>
        <Row className="g-4 justify-content-center">
          {features.map((f) => (
            <Col key={f.title} md={4}>
              <Card className="h-100 shadow-sm border-0 text-center p-3">
                <Card.Body>
                  <div style={{ fontSize: '2.5rem' }} className="mb-3">{f.icon}</div>
                  <Card.Title className="fw-semibold">{f.title}</Card.Title>
                  <Card.Text className="text-muted">{f.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA Banner */}
      <div className="bg-primary text-white text-center py-5">
        <Container>
          <h2 className="fw-bold mb-3">Ready to reach your goals?</h2>
          <Link to="/register" className="btn btn-light btn-lg px-5">
            Create Free Account
          </Link>
        </Container>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted py-4 small border-top">
        © {new Date().getFullYear()} FitTracker — Built with React & Laravel
      </footer>
    </>
  );
}
