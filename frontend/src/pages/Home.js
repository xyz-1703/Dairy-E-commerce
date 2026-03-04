import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { productAPI, categoryAPI } from '../api/api';
import { useCartStore } from '../store/cartStore';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, trending, cats] = await Promise.all([
          productAPI.featured(),
          productAPI.trending(),
          categoryAPI.list(),
        ]);
        setFeaturedProducts(featured.data.results || featured.data || []);
        setTrendingProducts(trending.data.results || trending.data || []);
        setCategories(cats.data.results || cats.data || []);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    const success = await addItem(productId, 1);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5 bg-success text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">Fresh Dairy Products</h1>
              <p className="lead">Get the freshest dairy products delivered to your doorstep</p>
              <Button as={Link} to="/products" size="lg" variant="light" className="me-2">
                Shop Now
              </Button>
              <Button as={Link} to="/" size="lg" variant="outline-light">
                Learn More
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <p className="text-muted" style={{ fontSize: '2rem' }}>Dairy Products</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <Container>
          <h2 className="mb-4">Shop by Category</h2>
          <Row className="g-4">
            {categories.slice(0, 6).map((category) => (
              <Col key={category.id} md={4} lg={2} className="mb-3">
                <CategoryCard category={category} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="mb-4">Featured Products</h2>
          <Row className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id} md={6} lg={3} className="mb-3">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/products" variant="success" size="lg">
              View All Products
            </Button>
          </div>
        </Container>
      </section>

      {/* Trending Products Section */}
      <section className="py-5">
        <Container>
          <h2 className="mb-4">Trending & On Sale</h2>
          <Row className="g-4">
            {trendingProducts.map((product) => (
              <Col key={product.id} md={6} lg={3} className="mb-3">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <h4>Free Delivery</h4>
              <p>On orders above ₹2500</p>
            </Col>
            <Col md={3} className="mb-4">
              <h4>Best Prices</h4>
              <p>Competitive rates guaranteed</p>
            </Col>
            <Col md={3} className="mb-4">
              <h4>Quality Guarantee</h4>
              <p>100% fresh products</p>
            </Col>
            <Col md={3} className="mb-4">
              <h4>Secure Payment</h4>
              <p>Safe transactions</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
