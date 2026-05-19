import { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/profileApi';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Weekly goal state
  const [weeklyGoal, setWeeklyGoal] = useState(3);
  const [goalLoading, setGoalLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Weight unit state
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [unitSaving, setUnitSaving] = useState(false);
  const [unitError, setUnitError] = useState<string | null>(null);
  const [unitSuccess, setUnitSuccess] = useState(false);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setWeeklyGoal(profile.weekly_workout_goal ?? 3);
        setWeightUnit((profile.weight_unit as 'lbs' | 'kg') ?? 'lbs');
      })
      .catch(() => {
        // Fall back to defaults silently
      })
      .finally(() => setGoalLoading(false));
  }, []);

  async function handleSaveGoal(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateProfile({ weekly_workout_goal: weeklyGoal });
      await refreshUser();
      setSaveSuccess(true);
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveUnit(e: React.FormEvent) {
    e.preventDefault();
    setUnitSaving(true);
    setUnitError(null);
    setUnitSuccess(false);
    try {
      await updateProfile({ weight_unit: weightUnit });
      await refreshUser();
      setUnitSuccess(true);
    } catch {
      setUnitError('Failed to save. Please try again.');
    } finally {
      setUnitSaving(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="mb-0">Profile &amp; Settings</h2>
        <p className="text-muted small mb-0">Manage your account details</p>
      </div>

      <Row className="g-4">
        {/* Personal Info */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Personal Information</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.name ?? ''}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={user?.email ?? ''}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
                <Button variant="primary" disabled>
                  Save Changes
                </Button>
                <Form.Text className="ms-2 text-muted">Coming soon</Form.Text>
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
                  <Form.Control type="password" placeholder="••••••••" disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" disabled />
                </Form.Group>
                <Button variant="outline-primary" disabled>
                  Update Password
                </Button>
                <Form.Text className="ms-2 text-muted">Coming soon</Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Workout Goals */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Workout Goals</Card.Header>
            <Card.Body>
              {goalLoading ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" className="text-muted" />
                </div>
              ) : (
                <Form onSubmit={handleSaveGoal}>
                  <Form.Group className="mb-3">
                    <Form.Label>Weekly Workout Goal</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="number"
                        value={weeklyGoal}
                        min={1}
                        max={14}
                        step={1}
                        style={{ width: 80 }}
                        onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                        required
                      />
                      <span className="text-muted">sessions per week</span>
                    </div>
                    <Form.Text className="text-muted">Between 1 and 14 sessions.</Form.Text>
                  </Form.Group>

                  {saveError && (
                    <Alert variant="danger" className="py-2">
                      {saveError}
                    </Alert>
                  )}
                  {saveSuccess && (
                    <Alert variant="success" className="py-2">
                      Goal saved!
                    </Alert>
                  )}

                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving…
                      </>
                    ) : (
                      'Save Goal'
                    )}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Preferences */}
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-semibold">Preferences</Card.Header>
            <Card.Body>
              {goalLoading ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" className="text-muted" />
                </div>
              ) : (
                <Form onSubmit={handleSaveUnit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Weight Unit</Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        label="lbs"
                        id="unit-lbs"
                        value="lbs"
                        checked={weightUnit === 'lbs'}
                        onChange={() => setWeightUnit('lbs')}
                      />
                      <Form.Check
                        type="radio"
                        label="kg"
                        id="unit-kg"
                        value="kg"
                        checked={weightUnit === 'kg'}
                        onChange={() => setWeightUnit('kg')}
                      />
                    </div>
                    <Form.Text className="text-muted">
                      Controls how weights are labeled across the app.
                    </Form.Text>
                  </Form.Group>

                  {unitError && (
                    <Alert variant="danger" className="py-2">
                      {unitError}
                    </Alert>
                  )}
                  {unitSuccess && (
                    <Alert variant="success" className="py-2">
                      Preferences saved!
                    </Alert>
                  )}

                  <Button variant="primary" type="submit" disabled={unitSaving}>
                    {unitSaving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Saving…
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
