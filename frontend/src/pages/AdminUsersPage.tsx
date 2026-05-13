import { Table, Badge, Button } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/admin/users
const placeholderUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', admin: false, joined: '2026-05-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', admin: false, joined: '2026-05-09' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', admin: true, joined: '2026-05-01' },
];

export default function AdminUsersPage() {
  const users = placeholderUsers;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Manage Users</h2>
      </div>

      {users.length > 0 ? (
        <Table responsive hover className="bg-white shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="fw-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <Badge bg={u.admin ? 'danger' : 'secondary'}>
                    {u.admin ? 'Admin' : 'User'}
                  </Badge>
                </td>
                <td>{new Date(u.joined).toLocaleDateString()}</td>
                <td className="text-end">
                  <Button variant="outline-danger" size="sm">Suspend</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState icon="👥" message="No users found" />
      )}
    </>
  );
}
