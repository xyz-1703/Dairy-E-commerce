import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI } from '../api/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: '',
    email: user?.email || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shipping_address || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.createFromCart(formData);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h3>Your cart is empty</h3>
        <Button href="/products" variant="success" className="mt-3">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="card-title mb-4">Shipping Information</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Full Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete shipping address"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </Form.Group>

                <h5 className="mt-4 mb-3">Payment Method</h5>
                <Form.Group className="mb-4">
                  <Form.Check
                    type="radio"
                    label="Credit/Debit Card"
                    name="payment"
                    id="card"
                    defaultChecked
                  />
                  <Form.Check
                    type="radio"
                    label="Cash on Delivery"
                    name="payment"
                    id="cod"
                  />
                </Form.Group>

                <Button
                  variant="success"
                  size="lg"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" className="me-2" /> : null}
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h5 className="card-title mb-3">Order Summary</h5>
              <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <div>
                      <div>{item.product_details.name}</div>
                      <small className="text-muted">x{item.quantity}</small>
                    </div>
                    <div>₹{item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
