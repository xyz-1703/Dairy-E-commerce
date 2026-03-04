import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-5">
      <Container>
        <Row className="mb-4">
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3">About Us</h5>
            <p>Dairy Mart provides the freshest dairy products sourced directly from trusted farms.</p>
            <div className="social-icons">
              <a href="#" className="me-3"><FaFacebook size={20} /></a>
              <a href="#" className="me-3"><FaTwitter size={20} /></a>
              <a href="#" className="me-3"><FaInstagram size={20} /></a>
              <a href="#" className="me-3"><FaLinkedin size={20} /></a>
            </div>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/">Contact Us</a></li>
              <li><a href="/">About Us</a></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="mb-3">Customer Service</h5>
            <ul className="list-unstyled">
              <li><a href="/">Track Order</a></li>
              <li><a href="/">Return Policy</a></li>
              <li><a href="/">FAQ</a></li>
              <li><a href="/">Delivery Info</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="mb-3">Contact</h5>
            <p>
              123 Dairy Lane, Farm City<br />
              +1 234-567-8900<br />
              ✉️ support@dairymart.com<br />
              ⏰ Mon - Sun: 8 AM - 8 PM
            </p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col md={6}>
            <p>© 2024 Dairy Mart. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>
              <a href="/" className="me-3">Privacy Policy</a> |
              <a href="/" className="ms-3 me-3">Terms & Conditions</a> |
              <a href="/" className="ms-3">Sitemap</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
