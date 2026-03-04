from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from app.models import Category, Product, Cart

class CategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Fresh Milk',
            description='Pure milk products'
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Fresh Milk')
        self.assertEqual(str(self.category), 'Fresh Milk')

    def test_category_list(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)

class ProductTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Fresh Milk')
        self.product = Product.objects.create(
            category=self.category,
            name='Cow Milk',
            description='Pure cow milk',
            price=4.50,
            discount_percentage=10,
            stock=100,
            image='products/test.jpg'
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, 'Cow Milk')
        self.assertEqual(self.product.price, 4.50)
        self.assertEqual(self.product.discounted_price, 4.05)

    def test_product_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)

class UserAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
        }

    def test_user_registration(self):
        response = self.client.post('/api/users/register/', self.user_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['username'], 'testuser')

    def test_user_login(self):
        User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)

class CartTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(name='Fresh Milk')
        self.product = Product.objects.create(
            category=self.category,
            name='Cow Milk',
            description='Pure cow milk',
            price=4.50,
            stock=100,
            image='products/test.jpg'
        )

    def test_cart_creation(self):
        cart, _ = Cart.objects.get_or_create(user=self.user)
        self.assertEqual(cart.user, self.user)

    def test_add_to_cart(self):
        response = self.client.post('/api/cart/add_item/', {
            'product_id': self.product.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, 200)
