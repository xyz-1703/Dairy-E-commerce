import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Cart = () => {
  const { items, totalPrice, totalItems, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    const success = await removeItem(itemId);
    if (success) {
      toast.success('Item removed from cart');
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="empty-state">
          <div className="empty-state-icon">No Items</div>
          <h3>Your cart is empty</h3>
          <p>Add some delicious dairy products to get started!</p>
          <Button as={Link} to="/products" variant="success" size="lg">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      <Row>
        <Col lg={8}>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/products/${item.product}`} className="text-decoration-none">
                      {item.product_details.name}
                    </Link>
                  </td>
                  <td>₹{item.product_details.discounted_price.toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      max={item.product_details.stock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>₹{item.total.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={4}>
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>₹0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
              {user ? (
                <>
                  <Button as={Link} to="/checkout" variant="success" className="w-100 mb-2">
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => {
                      if (window.confirm('Clear cart?')) {
                        clearCart();
                      }
                    }}
                  >
                    Clear Cart
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/login" variant="success" className="w-100">
                  Login to Checkout
                </Button>
              )}
              <Button
                as={Link}
                to="/products"
                variant="outline-secondary"
                className="w-100 mt-2"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
