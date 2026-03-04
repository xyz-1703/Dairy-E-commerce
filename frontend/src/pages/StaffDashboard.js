import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Card, Table, Badge, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { dashboardAPI, productAPI, orderAPI, categoryAPI } from '../api/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: '0',
    stock: '',
    category: '',
    unit: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products from multiple pages to get all
      const page1 = productAPI.list({}); 
      const page2 = productAPI.list({ page: 2 });
      
      const [statsRes, p1Res, p2Res, ordersRes, categoriesRes] = await Promise.all([
        dashboardAPI.stats(),
        page1,
        page2,
        dashboardAPI.orders(),
        categoryAPI.list(),
      ]);
      
      setStats(statsRes.data);
      // Combine products from both pages
      const page1Products = p1Res.data.results || [];
      const page2Products = p2Res.data.results || [];
      setProducts([...page1Products, ...page2Products]);
      setOrders(ordersRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProductModal = (product = null) => {
    setImageFile(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discount_percentage: product.discount_percentage,
        stock: product.stock,
        category: product.category,
        unit: product.unit,
        is_featured: product.is_featured,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discount_percentage: '0',
        stock: '',
        category: '',
        unit: '',
        is_featured: false,
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    try {
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        stock: parseInt(formData.stock),
        category: parseInt(formData.category),
        unit: formData.unit || '',
        is_featured: formData.is_featured,
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, dataToSend);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(dataToSend);
        toast.success('Product created successfully!');
      }
      setShowProductModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      let errorMessage = 'Failed to save product';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors?.[0]) {
          errorMessage = error.response.data.non_field_errors[0];
        } else {
          // Try to find first field error
          const firstError = Object.entries(error.response.data)[0];
          if (firstError && Array.isArray(firstError[1])) {
            errorMessage = `${firstError[0]}: ${firstError[1][0]}`;
          }
        }
      }
      toast.error(errorMessage);
    }
    setImageFile(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted successfully!');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !editingProduct) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploadingImage(true);
    try {
      await productAPI.uploadImage(editingProduct.id, imageFile);
      toast.success('Image uploaded successfully!');
      setImageFile(null);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsUploadingImage(false);
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
    <Container fluid className="py-4">
      <h1 className="mb-4">Staff Dashboard</h1>

      {/* Stats */}
      {stats && (
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="bg-primary text-white text-center">
              <Card.Body>
                <h6 className="card-subtitle">Total Products</h6>
                <h2>{stats.total_products}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="bg-success text-white text-center">
              <Card.Body>
                <h6 className="card-subtitle">Total Orders</h6>
                <h2>{stats.total_orders}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="bg-info text-white text-center">
              <Card.Body>
                <h6 className="card-subtitle">Total Users</h6>
                <h2>{stats.total_users}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="bg-warning text-white text-center">
              <Card.Body>
                <h6 className="card-subtitle">Total Revenue</h6>
                <h2>₹{parseFloat(stats.total_revenue).toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <Tabs defaultActiveKey="orders" className="mb-4">
        {/* Orders Tab */}
        <Tab eventKey="orders" title="Orders Management">
          <Card>
            <Card.Body>
              {orders.length === 0 ? (
                <Alert variant="info">No orders yet</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.username}</td>
                          <td>₹{parseFloat(order.total_price).toFixed(2)}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{ width: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </Form.Select>
                          </td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <Button variant="sm" size="sm" onClick={() => alert(order.shipping_address)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Products Tab */}
        <Tab eventKey="products" title="Products Management">
          <Card>
            <Card.Header>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleOpenProductModal()}
              >
                <FaPlus /> Add Product
              </Button>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <Alert variant="info">No products yet</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Discount</th>
                        <th>Featured</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category_name}</td>
                          <td>₹{parseFloat(product.price).toFixed(2)}</td>
                          <td>{product.stock}</td>
                          <td>{product.discount_percentage}%</td>
                          <td>
                            {product.is_featured ? (
                              <Badge bg="success">Yes</Badge>
                            ) : (
                              <Badge bg="secondary">No</Badge>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleOpenProductModal(product)}
                              className="me-2"
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount %</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., 1 Liter, 500g"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Featured Product"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="success" type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>

          {/* Image Upload Section - Only show for existing products */}
          {editingProduct && (
            <div className="mt-4 pt-4 border-top">
              <h6>Upload Product Image</h6>
              <Form.Group className="mb-3">
                <Form.Label>Select Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  disabled={isUploadingImage}
                />
                <Form.Text className="text-muted">
                  Supported formats: JPG, PNG, WebP (Max 5MB)
                </Form.Text>
              </Form.Group>
              {imageFile && (
                <div className="mb-3">
                  <small className="text-success">✓ Selected: {imageFile.name}</small>
                </div>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleImageUpload}
                disabled={!imageFile || isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StaffDashboard;
