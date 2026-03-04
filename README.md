# 🥛 Dairy Mart - Ecommerce Platform

A modern, full-stack ecommerce platform for dairy products built with Django REST Framework and React.js. Features complete CRUD operations, user authentication, shopping cart, order management, and a comprehensive staff dashboard.

## 🌟 Features

### 👥 Customer Features
- **User Authentication**: Register, login, profile management
- **Product Browsing**: Browse dairy products by categories with advanced filters
- **Search & Filter**: Full-text search, sort by price/rating, filter by category
- **Shopping Cart**: Add/remove products, quantity management, persistent cart
- **Checkout**: Complete checkout workflow with shipping details
- **Order Management**: View order history, track order status
- **Product Reviews**: Rate and review products with ratings
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5

### 👨‍💼 Staff/Admin Features
- **Staff Dashboard**: Comprehensive admin dashboard with statistics
- **Product Management**: Complete CRUD operations for products
- **Order Management**: View all orders, update order status
- **Statistics**: Real-time stats on products, orders, users, and revenue
- **Category Management**: Create and manage product categories
- **Stock Management**: Track and manage product inventory

### 🔐 Security Features
- JWT token-based authentication
- CORS headers configured for security
- Password hashing with Django's built-in system
- Protected admin endpoints
- User role-based access control

## 🛠️ Technology Stack

### Backend
```
Django 4.2.8
Django REST Framework 3.14.0
Django SimpleJWT 5.3.2
SQLite (with PostgreSQL option)
Python 3.8+
```

### Frontend
```
React 18.2.0
React Router v6
Axios for HTTP
Bootstrap 5
Zustand for state management
React Icons
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 14+ 
- npm or yarn
- Git

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Load sample data
python seed_data.py

# Run development server
python manage.py runserver
```

**Backend ready at:** `http://localhost:8000`

### Frontend Setup (3 minutes)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend ready at:** `http://localhost:3000`

## 🔐 Demo Credentials

### Customer Account
- **Username:** `customer`
- **Password:** `customer123`

### Staff Account
- **Username:** `staff`
- **Password:** `staff123`

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/token/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/users/register/` - User registration
- `GET /api/users/profile/` - Get user profile
- `POST /api/users/change_password/` - Change password

### Product Endpoints
- `GET /api/products/` - List products with pagination
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/trending/` - Get products on sale
- `POST /api/products/` - Create product (staff only)
- `PATCH /api/products/{id}/` - Update product (staff only)
- `DELETE /api/products/{id}/` - Delete product (staff only)
- `GET /api/products/{id}/reviews/` - Get product reviews
- `POST /api/products/{id}/reviews/` - Add review

### Cart Endpoints
- `GET /api/cart/` - Get shopping cart
- `POST /api/cart/add_item/` - Add item to cart
- `POST /api/cart/update_item/` - Update item quantity
- `POST /api/cart/remove_item/` - Remove item from cart
- `POST /api/cart/clear/` - Clear entire cart

### Order Endpoints
- `GET /api/orders/` - Get user orders
- `POST /api/orders/create_from_cart/` - Create order from cart
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/update_status/` - Update order status

### Category Endpoints
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (staff only)

### Dashboard Endpoints (Staff Only)
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/dashboard/orders/` - Get all orders

## 📁 Project Structure

```
Dairy Ecommerce/
├── backend/
│   ├── app/
│   │   ├── models.py              ← Database models
│   │   ├── views.py               ← API views
│   │   ├── serializers.py         ← DRF serializers
│   │   ├── urls.py                ← API routes
│   │   ├── admin.py               ← Admin configuration
│   │   └── tests.py               ← Unit tests
│   ├── dairy_ecom/
│   │   ├── settings.py            ← Django configuration
│   │   ├── urls.py                ← Main URL router
│   │   └── wsgi.py                ← WSGI configuration
│   ├── manage.py
│   ├── seed_data.py               ← Seed database script
│   └── requirements.txt            ← Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/            ← Reusable components
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── ProductCard.js
    │   │   ├── CategoryCard.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/                 ← Page components
    │   │   ├── Home.js
    │   │   ├── Products.js
    │   │   ├── ProductDetail.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── UserLogin.js
    │   │   ├── UserRegister.js
    │   │   ├── UserProfile.js
    │   │   ├── Orders.js
    │   │   ├── StaffLogin.js
    │   │   └── StaffDashboard.js
    │   ├── store/                 ← State management
    │   │   ├── authStore.js
    │   │   └── cartStore.js
    │   ├── api/
    │   │   └── api.js             ← Axios configuration
    │   ├── App.js                 ← Main app component
    │   └── index.js               ← Entry point
    ├── public/
    ├── package.json
    └── .env
```

## 🗄️ Database Models

### User (Django Built-in)
Standard Django user model with username, email, password

### Category
- `name`: Category name
- `description`: Category description
- `image`: Category image
- `created_at`: Creation timestamp

### Product
- `category`: Foreign key to Category
- `name`: Product name
- `description`: Detailed description
- `price`: Product price
- `discount_percentage`: Discount (0-100)
- `stock`: Available quantity
- `image`: Product image
- `rating`: Customer rating (1-5)
- `unit`: Measurement unit (1L, 500g, etc.)
- `is_featured`: Featured flag
- `created_at`/`updated_at`: Timestamps

### Cart & CartItem
- `user`: User's cart
- `product`: Product in cart
- `quantity`: Item quantity
- Auto-calculated: `total_price`, `total_items`

### Order & OrderItem
- `user`: Order owner
- `status`: pending, processing, shipped, delivered, cancelled
- `total_price`: Order amount
- `shipping_address`: Delivery address
- `phone`: Contact phone
- `email`: Contact email

### Review
- `product`: Product reviewed
- `user`: Reviewer
- `rating`: 1-5 stars
- `comment`: Review text
- `created_at`: Review date

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test                    # Run all tests
python manage.py test app.tests -v 2    # With verbosity
```

### Frontend Tests
```bash
cd frontend
npm test                                 # Run tests
npm test -- --coverage                  # With coverage
```

## 📦 Building for Production

### Backend
```bash
cd backend
pip install gunicorn
gunicorn dairy_ecom.wsgi:application --bind 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
npm run build
# Distributable files in /build folder
```

## 🌐 Deployment

### Deploy Backend to Heroku
```bash
cd backend
heroku create your-app-name
heroku config:set DISABLE_COLLECTSTATIC=1
git push heroku main
```

### Deploy Frontend to Netlify
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

## 🛠️ Customization

### Change Product Categories
1. Edit seed_data.py
2. Run `python seed_data.py`

### Customize Colors
Edit frontend CSS files:
- `src/index.css`
- `src/pages/Home.css`
- `src/components/Navbar.css`

### Add Custom Fields
1. Edit `app/models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Update serializers in `app/serializers.py`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `python manage.py runserver 8001` |
| Port 3000 in use | `npm start -- --port 3001` |
| CORS errors | Check Django server is running |
| Database errors | `python manage.py migrate` |
| Module not found | `pip install -r requirements.txt` |
| npm install fails | `npm install --legacy-peer-deps` |

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com)
- [Django REST Framework Docs](https://www.django-rest-framework.org)
- [React Documentation](https://reactjs.org)
- [Bootstrap 5 Docs](https://getbootstrap.com)
- [JWT Documentation](https://django-rest-framework-simplejwt.readthedocs.io)

## 📝 License

MIT License - Open source and free to use for educational and commercial purposes.

## 🤝 Support

Found a bug or have a question? Open an issue in the repository.

## 🎉 Key Accomplishments

✅ Full-stack ecommerce application  
✅ Complete user authentication system  
✅ Shopping cart with persistent storage  
✅ Order management workflow  
✅ Staff/Admin dashboard with CRUD  
✅ Product filtering and search  
✅ Responsive mobile design  
✅ RESTful API architecture  
✅ Secure JWT authentication  
✅ Database with sample data  

---

**Happy Building!** 🚀

Built with ♥️ for learning and demonstration purposes.
