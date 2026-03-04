import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isStaff, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <BSNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          <span style={{ color: '#28a745', fontSize: '1.5rem' }}>Dairy Mart</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/subscriptions">Subscriptions</Nav.Link>
          </Nav>
          <form onSubmit={handleSearch} className="d-flex me-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '150px' }}
            />
            <button type="submit" className="btn btn-sm btn-outline-success ms-2">
              Search
            </button>
          </form>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge bg="danger" className="position-absolute">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <Dropdown className="ms-3">
                <Dropdown.Toggle variant="light" id="user-dropdown" className="nav-link">
                  <FaUser /> {user.username}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-subscriptions">My Subscriptions</Dropdown.Item>
                  {isStaff && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/dashboard">Staff Dashboard</Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="ms-3">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="ms-2">Register</Nav.Link>
                <div className="vr ms-3 me-2"></div>
                <Nav.Link as={Link} to="/staff-login" className="ms-2">Staff Login</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
