import { Row, Col, Table } from 'react-bootstrap';
import StatCard from '../components/StatCard';

// TODO: Replace with real data from GET /api/admin/stats
const recentUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joined: '2026-05-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', joined: '2026-05-09' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', joined: '2026-05-08' },
];

export default function AdminDashboardPage() {
  return (
    <>
      <div className="mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <p className="text-muted small mb-0">Platform overview</p>
      </div>

      {/* Platform Stats */}
      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <StatCard title="Total Users" value="—" variant="primary" />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard title="Total Workouts" value="—" variant="success" />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard title="Exercise Library" value="—" variant="info" />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard title="Active Plans" value="—" variant="warning" />
        </Col>
      </Row>

      {/* Recent Registrations */}
      <h5 className="fw-semibold mb-3">Recent Registrations</h5>
      <Table responsive hover className="bg-white shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {recentUsers.map((u) => (
            <tr key={u.id}>
              <td className="fw-semibold">{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.joined).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
