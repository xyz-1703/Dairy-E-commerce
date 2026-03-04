from django.contrib import admin
from app.models import Category, Product, Cart, CartItem, Order, OrderItem, StaffProfile

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_percentage', 'stock', 'is_featured']
    list_filter = ['category', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    fieldsets = (
        ('Basic Info', {
            'fields': ('category', 'name', 'description', 'unit')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_percentage')
        }),
        ('Stock & Image', {
            'fields': ('stock', 'image')
        }),
        ('Featured', {
            'fields': ('is_featured',)
        }),
    )

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_price', 'created_at']
    search_fields = ['user__username']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity']
    search_fields = ['product__name', 'cart__user__username']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User Info', {
            'fields': ('user', 'email', 'phone')
        }),
        ('Shipping', {
            'fields': ('shipping_address',)
        }),
        ('Order Details', {
            'fields': ('status', 'total_price')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'product_price']
    search_fields = ['product_name', 'order__id']

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_staff', 'created_at']
    search_fields = ['user__username']
