import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPause, FaPlay, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../api/api';
import '../styles/MySubscriptions.css';

const SubscriptionManagerCard = ({ subscription, onUpdate, products }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    try {
      await api.post(`/subscriptions/${subscription.id}/add_item/`, {
        product_id: selectedProduct,
        quantity: parseInt(quantity),
      });
      toast.success('Product added to subscription');
      setShowModal(false);
      setSelectedProduct('');
      setQuantity(1);
      onUpdate();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.post(`/subscriptions/${subscription.id}/remove_item/`, {
        item_id: itemId,
      });
      toast.success('Product removed from subscription');
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const handlePause = async () => {
    try {
      await api.post(`/subscriptions/${subscription.id}/pause/`);
      toast.success('Subscription paused');
      onUpdate();
    } catch (error) {
      toast.error('Failed to pause subscription');
    }
  };

  const handleResume = async () => {
    try {
      await api.post(`/subscriptions/${subscription.id}/resume/`);
      toast.success('Subscription resumed');
      onUpdate();
    } catch (error) {
      toast.error('Failed to resume subscription');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await api.post(`/subscriptions/${subscription.id}/cancel/`);
        toast.success('Subscription cancelled');
        onUpdate();
      } catch (error) {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const statusColor = {
    'active': 'success',
    'paused': 'warning',
    'cancelled': 'danger'
  };

  return (
    <Card className="subscription-manager-card mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="mb-1">{subscription.plan_name}</Card.Title>
            <Card.Subtitle className="text-muted">
              <span className="badge" style={{ backgroundColor: `var(--bs-${statusColor[subscription.status]})` }}>
                {subscription.status.toUpperCase()}
              </span>
              <span className="ms-2">{subscription.plan_frequency} • {subscription.plan_discount}% OFF</span>
            </Card.Subtitle>
          </div>
          <small className="text-muted">ID: {subscription.id}</small>
        </div>

        <div className="delivery-info mb-3 p-2 bg-light rounded">
          <small className="d-block mb-2">
            Next Delivery: <strong>{new Date(subscription.next_delivery).toLocaleDateString()}</strong>
          </small>
          {subscription.pause_until && (
            <small className="text-warning">
              ⏸️ Paused until: {new Date(subscription.pause_until).toLocaleDateString()}
            </small>
          )}
        </div>

        <div className="subscription-items mb-3">
          <h6 className="mb-2">Items in Subscription:</h6>
          {subscription.items && subscription.items.length > 0 ? (
            <ul className="list-group list-group-sm">
              {subscription.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.product_name} x {item.quantity}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Alert variant="info" className="mb-0">No items added yet</Alert>
          )}
        </div>

        <div className="action-buttons d-flex gap-2 flex-wrap">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add Product
          </Button>

          {subscription.status === 'active' && (
            <Button 
              variant="warning" 
              size="sm"
              onClick={handlePause}
            >
              <FaPause /> Pause
            </Button>
          )}

          {subscription.status === 'paused' && (
            <Button 
              variant="success" 
              size="sm"
              onClick={handleResume}
            >
              <FaPlay /> Resume
            </Button>
          )}

          {subscription.status !== 'cancelled' && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={handleCancel}
            >
              <FaTrash /> Cancel
            </Button>
          )}
        </div>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product to Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Product</Form.Label>
              <Form.Select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddItem}>
            Add to Subscription
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [subRes, prodRes] = await Promise.all([
        api.get('/subscriptions/'),
        api.get('/products/'),
      ]);
      setSubscriptions(subRes.data.results || subRes.data || []);
      setProducts(prodRes.data.results || prodRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="page-header mb-4">
        <h1>My Subscriptions</h1>
        <p className="text-muted">Manage your active dairy subscriptions</p>
      </div>

      {subscriptions.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No Active Subscriptions</Alert.Heading>
          <p>
            Start a subscription to get regular dairy deliveries with exclusive discounts.
            <a href="/subscriptions" className="ms-2">Browse Plans</a>
          </p>
        </Alert>
      ) : (
        <Row>
          <Col lg={8}>
            {subscriptions.map((subscription) => (
              <SubscriptionManagerCard
                key={subscription.id}
                subscription={subscription}
                products={products}
                onUpdate={fetchData}
              />
            ))}
          </Col>

          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <Card.Title>Subscription Summary</Card.Title>
                
                <div className="summary-item mb-3">
                  <small className="text-muted">Active Plans</small>
                  <h4>{subscriptions.filter(s => s.status === 'active').length}</h4>
                </div>

                <div className="summary-item mb-3">
                  <small className="text-muted">Paused Plans</small>
                  <h4>{subscriptions.filter(s => s.status === 'paused').length}</h4>
                </div>

                <div className="summary-item">
                  <small className="text-muted">Total Products</small>
                  <h4>
                    {subscriptions.reduce((sum, s) => sum + (s.items?.length || 0), 0)}
                  </h4>
                </div>

                <hr />

                <a href="/subscriptions" className="btn btn-primary w-100">
                  Browse More Plans
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MySubscriptions;
