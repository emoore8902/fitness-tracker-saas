import { Table, Button, Badge } from 'react-bootstrap';
import EmptyState from '../components/EmptyState';

// TODO: Replace with real data from GET /api/exercise-categories (to be added to backend)
const placeholderCategories = [
  { id: 1, name: 'Chest', exercises: 12 },
  { id: 2, name: 'Back', exercises: 15 },
  { id: 3, name: 'Legs', exercises: 14 },
  { id: 4, name: 'Shoulders', exercises: 10 },
  { id: 5, name: 'Arms', exercises: 11 },
  { id: 6, name: 'Core', exercises: 8 },
];

export default function AdminCategoriesPage() {
  const categories = placeholderCategories;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Exercise Categories</h2>
        <Button variant="primary">+ Add Category</Button>
      </div>

      {categories.length > 0 ? (
        <Table responsive hover className="bg-white shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Exercises</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="fw-semibold">{cat.name}</td>
                <td><Badge bg="secondary">{cat.exercises}</Badge></td>
                <td className="text-end">
                  <Button variant="outline-primary" size="sm" className="me-1">Edit</Button>
                  <Button variant="outline-danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          icon="🏷️"
          message="No categories yet"
          action={<Button variant="primary">+ Add Category</Button>}
        />
      )}
    </>
  );
}
