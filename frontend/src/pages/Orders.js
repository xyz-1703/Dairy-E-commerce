import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { orderAPI } from '../api/api';

const OrderStatus = ({ status }) => {
  const variants = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };
  return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.list();
        setOrders(response.data.results || response.data || []);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">No orders yet. Start shopping!</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Orders</h1>
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Shipping</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>₹{parseFloat(order.total_price).toFixed(2)}</td>
                <td><OrderStatus status={order.status} /></td>
                <td>{order.shipping_address.substring(0, 30)}...</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Orders;
