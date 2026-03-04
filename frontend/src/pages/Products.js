import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../api/api';
import { useCartStore } from '../store/cartStore';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addItem } = useCartStore();

  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || '-created_at';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.list();
        setCategories(response.data.results || response.data || []);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ordering: sortBy,
        };
        if (searchQuery) params.search = searchQuery;
        if (categoryId) params.category = categoryId;

        const response = await productAPI.list(params);
        setProducts(response.data.results || response.data || []);
        setTotalPages(Math.ceil((response.data.count || response.data?.length || 0) / 12));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryId, sortBy, currentPage]);

  const handleAddToCart = async (productId) => {
    const success = await addItem(productId, 1);
    if (success) {
      toast.success('Added to cart!');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Our Products</h1>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <div className="sticky-top" style={{ top: '80px' }}>
            <h5>Filters</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchParams(e.target.value ? { category: e.target.value } : {});
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => {
                    setCurrentPage(1);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('sort', e.target.value);
                    setSearchParams(newParams);
                  }}
                >
                  <option value="-created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        </Col>

        {/* Products */}
        <Col md={9}>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">No Products</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <Row className="g-4 mb-4">
                {products.map((product) => (
                  <Col key={product.id} md={6} lg={4} className="mb-3">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum > currentPage + 2 || pageNum < currentPage - 2) return null;
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === currentPage}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}
                  <Pagination.Next
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
