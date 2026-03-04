import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import { userAPI } from '../api/api';

const UserProfile = () => {
  const { user } = useAuthStore();
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.changePassword(passwordData);
      toast.success('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '' });
      setMessage(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Profile</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="card-title">Profile Information</h5>
              <hr />
              <div className="mb-3">
                <label className="text-muted">Username</label>
                <p className="fw-bold">{user?.username}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted">Email</label>
                <p className="fw-bold">{user?.email}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted">Full Name</label>
                <p className="fw-bold">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="card-title">Change Password</h5>
              <hr />
              {message && <Alert variant="info">{message}</Alert>}
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button
                  variant="success"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
