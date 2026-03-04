import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import '../styles/Subscriptions.css';

const SubscriptionCard = ({ plan, onSubscribe }) => {
  return (
    <Card className="subscription-card h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="text-primary">{plan.name}</Card.Title>
        <p className="text-muted small">{plan.description}</p>
        
        <div className="plan-details mb-3">
          <div className="frequency mb-2">
            <span className="badge bg-info">{plan.frequency.toUpperCase()}</span>
          </div>
          <div className="discount-section">
            <h4 className="text-success">{plan.discount_percentage}% OFF</h4>
            <small className="text-muted">Subscriber discount</small>
          </div>
        </div>

        <Button 
          variant="primary" 
          className="w-100"
          onClick={() => onSubscribe(plan.id)}
        >
          Subscribe Now
        </Button>
      </Card.Body>
    </Card>
  );
};

const Subscriptions = () => {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscription-plans/');
        setPlans(response.data.results || response.data || []);
      } catch (error) {
        toast.error('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.warn('Please login to subscribe');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await api.post('/subscriptions/', { plan: planId });
      toast.success('Subscription created! Add products to your subscription.');
      // Redirect to my subscriptions
      window.location.href = '/my-subscriptions';
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 
                      error.response?.data?.detail || 
                      'Failed to create subscription';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="subscriptions-header text-center mb-5">
        <h1>Dairy Subscriptions</h1>
        <p className="lead text-muted">
          Subscribe to get fresh dairy delivered regularly with exclusive discounts
        </p>
      </div>

      {!isAuthenticated && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading>Login Required</Alert.Heading>
          <p>
            Please <a href="/login">login</a> to subscribe to our plans.
          </p>
        </Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {plans.map((plan) => (
          <Col key={plan.id}>
            <SubscriptionCard 
              plan={plan} 
              onSubscribe={handleSubscribe}
            />
          </Col>
        ))}
      </Row>

      {plans.length === 0 && (
        <Alert variant="warning" className="mt-4">
          No subscription plans available at the moment.
        </Alert>
      )}

      <div className="benefits-section mt-5 pt-4 border-top">
        <h3 className="mb-4">Subscription Benefits</h3>
        <Row>
          <Col md={4} className="mb-3">
            <div className="benefit-item">
              <h5>Save Money</h5>
              <p>Get exclusive discounts on every delivery</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="benefit-item">
              <h5>Free Delivery</h5>
              <p>Convenient home delivery on schedule</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="benefit-item">
              <h5>⏸️ Flexible</h5>
              <p>Pause or cancel anytime, no strings attached</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Subscriptions;
