# 🛍️ CRUD Implementation - Outfitters Admin Panel

## Overview
This document outlines the complete CRUD (Create, Read, Update, Delete) implementation for the Outfitters product management system with image upload, validation, and access control.

---

## ✅ Features Implemented

### 1. ➕ CREATE - Add Product
**Route:** `GET /admin/add` | `POST /admin/add`

**Features:**
- ✅ Responsive add product form (`/views/admin/add-product.ejs`)
- ✅ Client-side validation (empty field checks)
- ✅ Server-side validation (all required fields)
- ✅ Image upload with Multer
- ✅ File type validation (JPEG, JPG, PNG, GIF only)
- ✅ File size limit (5MB max)
- ✅ Flash messages for success/error
- ✅ Image preview before upload
- ✅ Additional fields: Description, Fit Type, SubCategory, Rating

**Form Fields:**
- Product Name (required)
- Price (required)
- Category (required): Men, Women, Juniors, Kids
- Stock Quantity (required)
- Product Image (required)
- Description (optional)
- Fit Type (optional): Regular Fit, Slim Fit, Oversized, Athletic Fit
- Sub Category (optional)
- Initial Rating (optional): 1-5

**Example:**
```bash
POST /admin/add
Body:
{
  name: "T-Shirt Classic",
  price: 1500,
  category: "Men",
  stock: 50,
  image: <file>,
  description: "High quality cotton shirt",
  fit: "Regular Fit"
}
```

---

### 2. 🖼️ IMAGE UPLOAD
**Technology:** Multer

**Configuration:**
- **Destination:** `/public/uploads/`
- **File Naming:** `timestamp-randomnumber.extension`
- **Supported Formats:** JPEG, JPG, PNG, GIF
- **Max File Size:** 5MB
- **Image Path Stored:** `/uploads/filename` (relative path for serving)

**How it Works:**
1. User selects image from form
2. Image is validated (type & size)
3. File is uploaded to `/public/uploads/`
4. Path is saved in MongoDB as: `/uploads/1234567890-123456789.jpg`
5. Image displayed on all product views

**Server-Side Setup:**
```javascript
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
```

---

### 3. 📖 READ - View Products
**Route:** `GET /admin`

**Features:**
- ✅ Display all products in table format
- ✅ Show product: Image, Name, Category, Price, Stock
- ✅ Sort by creation date (newest first)
- ✅ Empty state message if no products
- ✅ Product count statistics
- ✅ Stock level color coding:
  - 🟢 Green: Stock > 20
  - 🟠 Orange: Stock 1-20
  - 🔴 Red: Stock 0

**Table Features:**
- Thumbnail images
- Category badges
- Price display
- Stock quantity with color coding
- Edit and Delete action buttons

---

### 4. ✏️ UPDATE - Edit Product
**Route:** `GET /admin/edit/:id` | `POST /admin/edit/:id`

**Features:**
- ✅ Load existing product data in form
- ✅ Display current product image
- ✅ Optional image upload (keeps existing if not changed)
- ✅ All validation same as Create
- ✅ Flash messages for success/error
- ✅ Image preview for new image
- ✅ Product ID displayed for reference

**Editable Fields:**
- Name
- Price
- Category
- Stock Quantity
- Description
- Fit Type
- Sub Category
- Rating
- Image (optional)

**Example:**
```bash
POST /admin/edit/:productId
Body:
{
  name: "Updated Name",
  price: 2000,
  category: "Women",
  stock: 75,
  image: <file (optional)>,
  description: "Updated description"
}
```

---

### 5. ❌ DELETE - Remove Product
**Route:** `GET /admin/delete/:id`

**Features:**
- ✅ Delete product from database
- ✅ Modal confirmation dialog
- ✅ Beautiful confirmation popup with product name
- ✅ Keyboard support: ESC to cancel, ENTER to confirm
- ✅ Click outside modal to cancel
- ✅ Flash message after deletion
- ✅ Redirect to dashboard after deletion

**Confirmation Modal:**
- Shows product name
- Warning message: "This action cannot be undone"
- Two buttons: Yes Delete | Cancel
- ESC key to close
- Click outside to close

---

### 6. 🔐 ACCESS CONTROL
**Middleware:** `isAdmin` (in `/middleware/auth.js`)

**Protection:**
- ✅ All admin routes protected: `/admin/*`
- ✅ Admin middleware checks: `req.session.userId && req.session.role === 'admin'`
- ✅ Non-admin users redirected to home page
- ✅ Flash error message: "Access denied. Admin privileges required."

**Admin Authentication Flow:**
1. User logs in with admin credentials
2. Session role set to 'admin'
3. All admin routes checked by `isAdmin` middleware
4. Only users with role='admin' can access

**Check User Role (in views):**
```ejs
<% if (isAdmin) { %>
  <!-- Show admin panel link -->
  <a href="/admin">Admin Dashboard</a>
<% } %>
```

---

### 7. ✅ VALIDATION
**Client-Side (Frontend):**
- Empty field checks
- Number range validation
- File type validation
- Real-time form validation

**Server-Side (Backend):**
- Empty field checks with meaningful error messages
- Price validation (>= 0)
- Stock validation (>= 0)
- Category validation (must be from enum)
- File validation:
  - Must exist
  - Must be image format
  - Must be under 5MB
- MongoDB schema validation

**Error Messages:**
```
❌ Product name is required
❌ Valid price is required
❌ Category is required
❌ Valid stock quantity is required
❌ Product image is required
❌ Only image files are allowed (jpeg, jpg, png, gif)
```

---

## 📁 File Structure

```
project/
├── routes/
│   └── admin.js                    # All CRUD routes with Multer setup
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs          # Product list + delete modal
│   │   ├── add-product.ejs        # Add product form
│   │   └── edit-product.ejs       # Edit product form
│   └── partials/
│       └── admin-sidebar.ejs      # Admin navigation
├── models/
│   └── product.js                  # Product schema
├── middleware/
│   └── auth.js                     # isAdmin authentication
├── config/
│   └── db.js                       # MongoDB connection
├── public/
│   ├── uploads/                    # Uploaded product images
│   │   └── 1234567890-123456789.jpg
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   └── js/
└── app.js                          # Express app setup
```

---

## 🚀 How to Use

### Access Admin Panel
1. **Login as Admin:**
   - Email: admin@outfitters.com
   - Password: (admin password)
   - User role must be: `admin`

2. **Navigate to Admin:**
   - Click "Admin Dashboard" link
   - Or go to: `http://localhost:3000/admin`

### Add Product
1. Click **"➕ Add Product"** button
2. Fill in all required fields:
   - Product Name
   - Price
   - Category
   - Stock
   - Image
3. (Optional) Fill additional details
4. Click **"✓ Save Product"**
5. See success message
6. Redirected to dashboard

### Edit Product
1. On dashboard, click **"✏️ Edit"** button
2. Form pre-fills with existing data
3. Modify any fields
4. (Optional) Upload new image
5. Click **"✓ Update Product"**
6. See success message

### Delete Product
1. On dashboard, click **"❌ Delete"** button
2. Modal confirmation dialog appears
3. Click **"Yes, Delete"** to confirm
4. Product removed from database
5. See success message

---

## 🛡️ Security Features

1. **Authentication Required:**
   - Only logged-in admin users can access admin routes
   - Session-based authentication

2. **File Upload Security:**
   - File type validation (only images)
   - File size limit (5MB)
   - Unique filename generation (prevents overwrites)
   - Files stored outside accessible routes initially

3. **Input Validation:**
   - Empty field validation
   - Type checking
   - Range checking

4. **Error Handling:**
   - Try-catch blocks on all routes
   - Meaningful error messages
   - File cleanup on errors

---

## 🧪 Testing Checklist

- [ ] Add a product with all fields
- [ ] Add a product with minimal fields
- [ ] Try adding without required fields (should fail)
- [ ] Upload an image (check in /public/uploads/)
- [ ] View products on dashboard
- [ ] Edit a product (change name, price, stock)
- [ ] Edit product with new image
- [ ] Delete a product via modal
- [ ] Try accessing /admin without login (should redirect)
- [ ] Try accessing /admin as non-admin user (should fail)
- [ ] Check all flash messages appear correctly
- [ ] Test form validation client-side
- [ ] Test form validation server-side

---

## 📝 Notes

- Images are stored in `/public/uploads/`
- Use `.gitkeep` file to track empty uploads folder
- All timestamps are in UTC by default
- Multer saves files with unique names: `timestamp-random.ext`
- Database tracks creation and update timestamps automatically

---

## 🐛 Troubleshooting

**Images not showing:**
- Check `/public/uploads/` folder exists
- Check image path in database
- Ensure public folder is served statically in app.js

**Upload fails:**
- Check file size (max 5MB)
- Check file type (only images)
- Check folder permissions on `/public/uploads/`

**Can't access admin:**
- Check user role in database is 'admin'
- Check session is saved in MongoDB
- Try logout and login again

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Bulk delete products
- [ ] Export products to CSV
- [ ] Product search/filter on admin dashboard
- [ ] Image cropping before upload
- [ ] Product templates
- [ ] Stock alerts
- [ ] Activity logs
- [ ] Image gallery for each product

---

**Last Updated:** May 14, 2026
**Version:** 1.0.0
