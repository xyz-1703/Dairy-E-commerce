import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import { productAPI } from '../api/api';
import { useCartStore } from '../store/cartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await productAPI.get(id);
        setProduct(productRes.data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    const success = await addItem(product.id, quantity);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col md={5}>
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="img-fluid rounded"
          />
        </Col>
        <Col md={7}>
          <h1>{product.name}</h1>
          <p className="text-muted mb-4">{product.description}</p>
          <div className="mb-4">
            <h4 className="mb-2">Category: {product.category_name}</h4>
            <p>Unit: {product.unit}</p>
          </div>
          <div className="price-section mb-4">
            {product.discount_percentage > 0 && (
              <span className="original-price">₹{parseFloat(product.price).toFixed(2)}</span>
            )}
            <span className="price">₹{parseFloat(product.discounted_price).toFixed(2)}</span>
            {product.discount_percentage > 0 && (
              <span className="discount-badge ms-2">Save {product.discount_percentage}%</span>
            )}
          </div>
          {product.stock > 0 ? (
            <div className="d-flex gap-3">
              <Form.Group style={{ width: '150px' }}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </Form.Group>
              <div className="align-self-end">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart /> Add to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">Out of Stock</div>
          )}
          <p className="text-muted mt-3">Stock: {product.stock} units available</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
