import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category.id}`} className="text-decoration-none">
      <Card className="category-card text-center h-100">
        <div className="category-image-container">
          <Card.Img
            variant="top"
            src={category.image_url || category.image || 'https://via.placeholder.com/150'}
            alt={category.name}
            className="category-image"
          />
        </div>
        <Card.Body>
          <Card.Title className="mb-0">{category.name}</Card.Title>
          <small className="text-muted">Shop Now →</small>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CategoryCard;
