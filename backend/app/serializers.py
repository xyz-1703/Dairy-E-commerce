from rest_framework import serializers
from django.contrib.auth.models import User
from app.models import Category, Product, Cart, CartItem, Order, OrderItem, StaffProfile, SubscriptionPlan, UserSubscription, SubscriptionItem, RecurringOrder

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['id', 'is_staff']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        try:
            Cart.objects.create(user=user)
        except:
            pass
        return user

class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'image_url', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            image_url = obj.image.url
            if request:
                return request.build_absolute_uri(image_url)
            return image_url
        return None

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discounted_price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'description', 'price', 
            'discount_percentage', 'discounted_price', 'stock', 'image', 'image_url',
            'unit', 'is_featured', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_discounted_price(self, obj):
        return obj.discounted_price

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            image_url = obj.image.url
            if request:
                # Use the request's host to make it work in dev and production
                return request.build_absolute_uri(image_url)
            # Fallback if no request (shouldn't happen in normal operation)
            return image_url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'product_details', 'quantity', 'total']
        read_only_fields = ['id', 'cart']

    def get_total(self, obj):
        return obj.get_total()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'total_items']
        read_only_fields = ['id', 'user']

    def get_total_price(self, obj):
        return obj.total_price

    def get_total_items(self, obj):
        return obj.total_items

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity', 'discount_percentage']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'username', 'status', 'total_price', 
            'shipping_address', 'phone', 'email', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class StaffProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = StaffProfile
        fields = ['id', 'user', 'user_details', 'is_staff', 'created_at']
        read_only_fields = ['id', 'is_staff', 'created_at']

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'description', 'frequency', 'discount_percentage', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class SubscriptionItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SubscriptionItem
        fields = ['id', 'product_id', 'product_name', 'product_price', 'quantity']
        read_only_fields = ['id', 'product_name', 'product_price']

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    plan_frequency = serializers.CharField(source='plan.frequency', read_only=True)
    plan_discount = serializers.FloatField(source='plan.discount_percentage', read_only=True)
    items = SubscriptionItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = [
            'id', 'user', 'plan', 'plan_name', 'plan_frequency', 'plan_discount',
            'status', 'next_delivery', 'pause_until', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class RecurringOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringOrder
        fields = ['id', 'subscription', 'order', 'scheduled_date', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
