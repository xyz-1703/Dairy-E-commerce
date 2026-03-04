# SETUP INSTRUCTIONS - Dairy Mart Ecommerce

Complete step-by-step guide to get the Dairy Mart application running locally.

## System Requirements

- **OS:** Windows 10+, macOS 10.14+, or Ubuntu 18.04+
- **Python:** 3.8 or higher
- **Node.js:** 14.0.0 or higher
- **RAM:** 2GB minimum
- **Disk Space:** 1GB free

## Installation Steps

### Step 1: Backend Setup (Django)

#### 1a. Open PowerShell/Terminal
Navigate to the backend directory:


#### 1b. Create Python Virtual Environment
```powershell
python -m venv .venv
```

#### 1c. Activate Virtual Environment
**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

#### 1d. Install Python Dependencies
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

Expected packages to install:
- Django 4.2.8
- djangorestframework 3.14.0
- djangorestframework-simplejwt 5.3.2
- django-cors-headers 4.3.1
- Pillow 10.1.0
- And others...

#### 1e. Apply Database Migrations
```powershell
python manage.py migrate
```

This creates the SQLite database and tables.

#### 1f. Load Sample Data
```powershell
python seed_data.py
```

This creates:
- 6 dairy categories
- 24 sample products
- Demo customer account (username: customer, password: customer123)
- Demo staff account (username: staff, password: staff123)

#### 1g. Run Django Server
```powershell
python manage.py runserver
```

**Success! You should see:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Keep this terminal/PowerShell window open!

**Django is now running on:** http://localhost:8000

---

### Step 2: Frontend Setup (React)

#### 2a. Open New Terminal/PowerShell Window
Navigate to frontend:


#### 2b. Install Node Dependencies
```powershell
npm install
```

This downloads all React packages (~500MB). Takes 2-5 minutes.

#### 2c. Verify .env File
Ensure `frontend/.env` contains:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MEDIA_URL=http://localhost:8000
```

#### 2d. Start React Development Server
```powershell
npm start
```

**Success! You should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

The browser will automatically open http://localhost:3000

---

## Access the Application

After both servers are running:

| Component | URL | Notes |
|-----------|-----|-------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000/api/ | Browsable API |
| Admin Panel | http://localhost:8000/admin/ | Django admin |
| API Docs | http://localhost:8000/api/products/ | View endpoints |

---

##  Test Login

### 1. Login as Customer
1. Click \"Login\" in the navbar
2. Username: `customer`
3. Password: `customer123`
4. Click Login

### 2. Browse Products
1. Click \"Products\" or shop around
2. You should see 24 dairy products
3. Try filters and search

### 3. Add to Cart
1. Click \"Add to Cart\" on any product
2. Go to cart (cart icon in navbar)
3. Modify quantities

### 4. Test Staff Dashboard
1. Logout (click your username → Logout)
2. Click \"Staff Login\" in navbar
3. Username: `staff`
4. Password: `staff123`
5. Click the \"Staff Dashboard\" link in dropdown
6. See statistics, manage products & orders

---

##  Verification Checklist

After setup, verify:

- [ ] Django server running on port 8000
- [ ] React server running on port 3000
- [ ] Can access http://localhost:3000 in browser
- [ ] Can access http://localhost:8000/admin
- [ ] Django admin page loads
- [ ] React frontend loads with Navbar and products
- [ ] Can login with customer credentials
- [ ] Can add products to cart
- [ ] Can access staff dashboard with staff credentials
- [ ] Can see products list in staff dashboard

---

##  Common Issues & Fixes

### Issue 1: Python Command Not Found
```
'python' is not recognized as an internal or external command
```

**Fix:**
1. Install Python from https://www.python.org/
2. Check \"Add Python to PATH\" during installation
3. Restart computer
4. Try `python --version`

### Issue 2: Virtual Environment Won't Activate
```
.venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled
```

**Fix (Windows PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try again.

### Issue 3: Port 8000 Already in Use
```
Error: That port is already in use.
```

**Fix:**
```powershell
python manage.py runserver 8001
```

Then update frontend `.env`:
```
REACT_APP_API_URL=http://localhost:8001/api
REACT_APP_MEDIA_URL=http://localhost:8001
```

### Issue 4: Port 3000 Already in Use
```
Something is already using port 3000.
```

**Fix:**
```powershell
npm start -- --port 3001
```

### Issue 5: CORS Errors in Browser Console
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:** Ensure Django backend is running on port 8000

### Issue 6: Module Not Found Error
```
ModuleNotFoundError: No module named 'rest_framework'
```

**Fix:**
```powershell
# Make sure venv is activated
pip install -r requirements.txt
```

### Issue 7: npm install Fails
```
npm ERR! code ERESOLVE
```

**Fix:**
```powershell
npm install --legacy-peer-deps
```

### Issue 8: Database Table Doesn't Exist
```
django.db.utils.OperationalError: no such table
```

**Fix:**
```powershell
python manage.py migrate
```

---

## Testing Features

### Customer Workflow
1. **Browse**: Products page shows all dairy items
2. **Filter**: Select category (Fresh Milk, Yogurt, etc.)
3. **Search**: Find products by name
4. **Add Cart**: Click \"Add to Cart\"
5. **Checkout**: Complete order with shipping details
6. **View Orders**: See order history and status

### Staff Workflow
1. **Dashboard**: See statistics
2. **Order Management**: Update order status
3. **Product Management**: Create/Edit/Delete products
4. **Stock**: View/Update inventory
5. **Categories**: Manage product categories

---

## Database

### View Data in Admin
1. Go to http://localhost:8000/admin/
2. Login with staff credentials (staff/staff123)
3. Browse all models and data

### Reset Database
```powershell
# Delete database
rm db.sqlite3

# Recreate and migrate
python manage.py migrate

# Reload sample data
python seed_data.py
```

---

## Default Sample Data

### Categories (6 total)
- Fresh Milk
- Yogurt
- Cheese
- Butter & Ghee
- Cream & Paneer
- Ice Cream

### Products (24 total)
- 4 per category
- Varying prices ($3-$22)
- Different discounts (0-25% off)
- In stock status
- Ratings (4.3-4.9 stars)

### Users (2 total)
- Customer: `customer` / `customer123`
- Staff: `staff` / `staff123` (Superuser)

---

##  Running Servers in Background

### Using Docker (Optional)
```bash
# Build and run with Docker
docker-compose up
```

### Using Screen (Linux/macOS)
```bash
# Django
screen -S django python manage.py runserver
# Press Ctrl+A then D to detach

# React (in new screen)
screen -S react npm start
```

---

##  Next Steps

After successful setup:

1. **Explore the Code**
   - Read backend/app/models.py
   - Read frontend/src/pages/Home.js
   - Check API responses in browser DevTools

2. **Make Changes**
   - Edit product details
   - Create new category
   - Modify CSS styles
   - Add new fields

3. **Deploy** (Later)
   - Deploy backend to Heroku
   - Deploy frontend to Netlify
   - Setup PostgreSQL database

4. **Enhance** (Optional)
   - Add payment gateway
   - Email notifications
   - Advanced analytics
   - Wishlist feature

---

##  Need Help?

### Check These First:
1. Are both terminal windows still open?
2. Are both servers running (8000 and 3000)?
3. Is virtual environment activated? (check venv in terminal)
4. Did migrations complete without errors?
5. Did seed_data.py run successfully?

### Debug Tips:
- Check terminal errors carefully
- Try clearing browser cache (Ctrl+Shift+Del)
- Restart both servers
- Verify database exists: `ls db.sqlite3`
- Check API: Visit http://localhost:8000/api/products/

---

##  Support

For detailed issues:
1. Check README.md in project root
2. Check backend/README.md
3. Check frontend/README.md
4. Review Django documentation
5. Review React documentation

---

**Congratulations! Your Dairy Mart application is ready!** 🎉

Start by visiting: **http://localhost:3000**
