import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/app/dashboard" className="fw-bold">
          💪 FitTracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/app/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/app/exercises">Exercises</Nav.Link>
            <Nav.Link as={NavLink} to="/app/workout-plans">Plans</Nav.Link>
            <Nav.Link as={NavLink} to="/app/workout-logs">Log</Nav.Link>
            <Nav.Link as={NavLink} to="/app/history">History</Nav.Link>

            {/* Admin dropdown — only visible to admins */}
            {user?.is_admin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/app/admin">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/app/admin/users">
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/app/admin/categories">
                  Categories
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/app/admin/exercises">
                  Global Exercises
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            <Nav.Link as={NavLink} to="/app/profile" className="text-white-50">
              {user?.name ?? 'Account'}
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
