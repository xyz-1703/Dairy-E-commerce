import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const hasDiscount = product.discount_percentage > 0;

  return (
    <Card className="product-card h-100">
      <div className="product-image-container position-relative">
        <Card.Img
          variant="top"
          src={product.image_url || 'https://via.placeholder.com/250'}
          className="product-image"
          alt={product.name}
        />
        {hasDiscount && (
          <span className="discount-badge position-absolute">
            -{product.discount_percentage}%
          </span>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate" title={product.name}>
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.unit}
        </Card.Text>
        <div className="price-section mb-3">
          {hasDiscount && (
            <span className="original-price">₹{parseFloat(product.price).toFixed(2)}</span>
          )}
          <span className="price">₹{parseFloat(product.discounted_price).toFixed(2)}</span>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            className="flex-grow-1"
            onClick={() => onAddToCart(product.id)}
          >
            <FaShoppingCart /> Add
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            as={Link}
            to={`/products/${product.id}`}
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
