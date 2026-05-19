import { useEffect, useState, useCallback } from 'react';
import { Table, Badge } from 'react-bootstrap';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getAdminUsers } from '../api/adminApi';
import type { User } from '../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Manage Users</h2>
          <p className="text-muted small mb-0">All registered accounts</p>
        </div>
      </div>

      {loading && <LoadingState message="Loading users…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadUsers} />}

      {!loading && !error && users.length === 0 && (
        <EmptyState icon="👥" message="No users found" />
      )}

      {!loading && !error && users.length > 0 && (
        <div className="table-responsive">
          <Table hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted">{u.id}</td>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.is_admin ? 'danger' : 'secondary'}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
