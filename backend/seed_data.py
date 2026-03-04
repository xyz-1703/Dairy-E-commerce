import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dairy_ecom.settings')
django.setup()

from django.contrib.auth.models import User
from app.models import Category, Product, SubscriptionPlan

def seed_data():
    # Clear existing data
    Product.objects.all().delete()
    Category.objects.all().delete()

    # Create categories
    categories_data = [
        {'name': 'Fresh Milk', 'description': 'Pure and fresh milk products'},
        {'name': 'Yogurt', 'description': 'Creamy and delicious yogurt varieties'},
        {'name': 'Cheese', 'description': 'Premium quality cheese products'},
        {'name': 'Butter & Ghee', 'description': 'Pure butter and clarified ghee'},
        {'name': 'Cream & Paneer', 'description': 'Fresh cream and paneer'},
        {'name': 'Ice Cream', 'description': 'Delicious frozen dairy treats'},
    ]

    categories = {}
    for cat_data in categories_data:
        cat, _ = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        categories[cat_data['name']] = cat

    # Create products
    products_data = [
        # Fresh Milk
        {'name': 'Pure Fresh Cow Milk', 'category': 'Fresh Milk', 'price': 4.50, 'discount': 10, 'stock': 100, 'unit': '1 Liter', 'featured': True},
        {'name': 'Organic Buffalo Milk', 'category': 'Fresh Milk', 'price': 5.00, 'discount': 5, 'stock': 80, 'unit': '1 Liter', 'featured': True},
        {'name': 'Double Toned Milk', 'category': 'Fresh Milk', 'price': 3.50, 'discount': 0, 'stock': 150, 'unit': '1 Liter', 'featured': False},
        {'name': 'Skimmed Milk', 'category': 'Fresh Milk', 'price': 3.00, 'discount': 15, 'stock': 120, 'unit': '1 Liter', 'featured': False},
        
        # Yogurt
        {'name': 'Greek Yogurt', 'category': 'Yogurt', 'price': 6.50, 'discount': 20, 'stock': 90, 'unit': '500g', 'featured': True},
        {'name': 'Natural Yogurt', 'category': 'Yogurt', 'price': 4.00, 'discount': 0, 'stock': 110, 'unit': '400g', 'featured': False},
        {'name': 'Fruit Yogurt Mix', 'category': 'Yogurt', 'price': 5.00, 'discount': 10, 'stock': 95, 'unit': '500g', 'featured': True},
        {'name': 'Low Fat Yogurt', 'category': 'Yogurt', 'price': 3.50, 'discount': 5, 'stock': 130, 'unit': '400g', 'featured': False},
        
        # Cheese
        {'name': 'Cheddar Cheese Block', 'category': 'Cheese', 'price': 12.00, 'discount': 15, 'stock': 50, 'unit': '500g', 'featured': True},
        {'name': 'Mozzarella Cheese', 'category': 'Cheese', 'price': 10.00, 'discount': 10, 'stock': 60, 'unit': '400g', 'featured': False},
        {'name': 'Parmesan Cheese', 'category': 'Cheese', 'price': 15.00, 'discount': 20, 'stock': 40, 'unit': '300g', 'featured': True},
        {'name': 'Cottage Cheese', 'category': 'Cheese', 'price': 8.00, 'discount': 0, 'stock': 75, 'unit': '400g', 'featured': False},
        
        # Butter & Ghee
        {'name': 'Pure Cow Ghee', 'category': 'Butter & Ghee', 'price': 18.00, 'discount': 10, 'stock': 70, 'unit': '500ml', 'featured': True},
        {'name': 'Salted Butter', 'category': 'Butter & Ghee', 'price': 8.50, 'discount': 5, 'stock': 85, 'unit': '500g', 'featured': False},
        {'name': 'Unsalted Butter', 'category': 'Butter & Ghee', 'price': 8.00, 'discount': 0, 'stock': 80, 'unit': '500g', 'featured': True},
        {'name': 'Organic Ghee', 'category': 'Butter & Ghee', 'price': 22.00, 'discount': 15, 'stock': 50, 'unit': '500ml', 'featured': False},
        
        # Cream & Paneer
        {'name': 'Fresh Paneer', 'category': 'Cream & Paneer', 'price': 7.00, 'discount': 10, 'stock': 100, 'unit': '500g', 'featured': True},
        {'name': 'Heavy Cream', 'category': 'Cream & Paneer', 'price': 6.00, 'discount': 0, 'stock': 90, 'unit': '200ml', 'featured': False},
        {'name': 'Whipped Cream', 'category': 'Cream & Paneer', 'price': 5.50, 'discount': 20, 'stock': 70, 'unit': '200ml', 'featured': True},
        {'name': 'Cottage Paneer', 'category': 'Cream & Paneer', 'price': 8.00, 'discount': 5, 'stock': 85, 'unit': '500g', 'featured': False},
        
        # Ice Cream
        {'name': 'Vanilla Ice Cream', 'category': 'Ice Cream', 'price': 5.00, 'discount': 25, 'stock': 120, 'unit': '500ml', 'featured': True},
        {'name': 'Chocolate Ice Cream', 'category': 'Ice Cream', 'price': 5.50, 'discount': 15, 'stock': 110, 'unit': '500ml', 'featured': True},
        {'name': 'Strawberry Ice Cream', 'category': 'Ice Cream', 'price': 5.00, 'discount': 20, 'stock': 100, 'unit': '500ml', 'featured': False},
        {'name': 'Mango Ice Cream', 'category': 'Ice Cream', 'price': 6.00, 'discount': 10, 'stock': 95, 'unit': '500ml', 'featured': True},
    ]

    for product_data in products_data:
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            defaults={
                'category': categories[product_data['category']],
                'price': product_data['price'],
                'discount_percentage': product_data['discount'],
                'stock': product_data['stock'],
                'unit': product_data['unit'],
                'is_featured': product_data['featured'],
                'description': f'High quality {product_data["name"].lower()} sourced from trusted dairy farms. Perfect for your daily needs.',
                'image': 'products/default.jpg'
            }
        )
        if created:
            print(f'Created product: {product.name}')

    # Create subscription plans
    subscription_plans = [
        {
            'name': 'Weekly Essential Pack',
            'description': 'Get fresh dairy products delivered every week at 15% discount',
            'frequency': 'weekly',
            'discount_percentage': 15,
        },
        {
            'name': 'Bi-Weekly Bundle',
            'description': 'Curated selection delivered every two weeks with 12% discount',
            'frequency': 'biweekly',
            'discount_percentage': 12,
        },
        {
            'name': 'Monthly Premium',
            'description': 'Full month supply of premium dairy products with 20% discount',
            'frequency': 'monthly',
            'discount_percentage': 20,
        },
    ]

    for plan_data in subscription_plans:
        plan, created = SubscriptionPlan.objects.get_or_create(
            name=plan_data['name'],
            defaults={
                'description': plan_data['description'],
                'frequency': plan_data['frequency'],
                'discount_percentage': plan_data['discount_percentage'],
                'is_active': True,
            }
        )
        if created:
            print(f'Created subscription plan: {plan.name}')

    # Create a staff user
    if not User.objects.filter(username='staff').exists():
        staff_user = User.objects.create_user(
            username='staff',
            email='staff@dairy.com',
            password='staff123',
            first_name='Staff',
            last_name='Member',
            is_staff=True,
            is_superuser=True
        )
        print(f'Created staff user: {staff_user.username}')

    # Create a regular user
    if not User.objects.filter(username='customer').exists():
        customer_user = User.objects.create_user(
            username='customer',
            email='customer@dairy.com',
            password='customer123',
            first_name='John',
            last_name='Doe'
        )
        print(f'Created customer user: {customer_user.username}')

    print('Seed data created successfully!')

if __name__ == '__main__':
    seed_data()
