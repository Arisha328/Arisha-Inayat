# ⚡ Quick Start Guide - CRUD Operations

## 🎯 What's Been Implemented

Your Outfitters app now has complete CRUD functionality:

### ✅ CREATE
- Add product form with validation
- Image upload to `/public/uploads/`
- All fields: name, price, category, stock, image, description, fit, rating

### ✅ READ
- Admin dashboard showing all products
- Product table with images and details
- Product count statistics

### ✅ UPDATE
- Edit product button on dashboard
- Pre-fill existing data
- Optional new image upload
- Full validation

### ✅ DELETE
- Beautiful confirmation modal
- Product name shows in confirmation
- Keyboard support (ESC to close)
- Click outside modal to cancel

### ✅ IMAGE UPLOAD
- Multer configured for image uploads
- File validation (JPEG, PNG, GIF only)
- 5MB file size limit
- Unique filename generation
- Images saved to `/public/uploads/`

### ✅ ACCESS CONTROL
- Admin authentication required
- Login middleware checks role='admin'
- Non-admins redirected to home
- Flash error messages

---

## 🚀 Getting Started

### 1. Make Sure Admin User Exists
Check your database for a user with `role: "admin"`

If not, create one:
```javascript
// In MongoDB or seed file
{
  name: "Admin User",
  email: "admin@outfitters.com",
  password: "hashedPassword",
  role: "admin"
}
```

### 2. Start the Server
```bash
npm start
# or for development
npm run dev
```

Server runs on: `http://localhost:3000`

### 3. Login as Admin
- Go to: `http://localhost:3000/login`
- Email: `admin@outfitters.com`
- Password: (your admin password)

### 4. Access Admin Panel
After login, click "Admin Dashboard" or go to:
- `http://localhost:3000/admin`

---

## 📋 API Endpoints

### Admin Routes (All Protected by isAdmin Middleware)

```
GET    /admin                 → View all products (dashboard)
GET    /admin/add             → Show add product form
POST   /admin/add             → Create new product with image
GET    /admin/edit/:id        → Show edit product form
POST   /admin/edit/:id        → Update product with optional image
GET    /admin/delete/:id      → Delete product
```

---

## 📁 Files Modified/Created

### Updated Files:
1. **routes/admin.js**
   - Complete CRUD routes
   - Multer configuration
   - Error handling with try-catch
   - Validation on server-side
   - Flash messages

2. **views/admin/dashboard.ejs**
   - Product table with styling
   - Delete confirmation modal
   - Statistics card
   - Flash message display

3. **views/admin/add-product.ejs**
   - Form with validation
   - Image preview
   - Client-side validation
   - All product fields

4. **views/admin/edit-product.ejs**
   - Pre-filled form with existing data
   - Current image display
   - New image preview
   - Update button

### New Files:
- `/public/uploads/.gitkeep` (ensures folder exists)
- `CRUD_IMPLEMENTATION.md` (detailed documentation)
- `QUICK_START.md` (this file!)

---

## 🧪 Test It Out

### Test Add Product:
1. Go to `/admin`
2. Click "➕ Add Product"
3. Fill form:
   - Name: "Test T-Shirt"
   - Price: 1500
   - Category: Men
   - Stock: 50
   - Upload image
4. Click "✓ Save Product"
5. See success message ✓

### Test Edit Product:
1. On dashboard, click "✏️ Edit"
2. Change price to 2000
3. Optionally upload new image
4. Click "✓ Update Product"
5. See success message ✓

### Test Delete Product:
1. On dashboard, click "❌ Delete"
2. Modal appears asking for confirmation
3. Click "Yes, Delete"
4. Product removed, see success message ✓

---

## ⚠️ Important Notes

### Database
- Product model must have these fields:
  - name (string, required)
  - price (number, required)
  - category (string, enum)
  - stock (number)
  - image (string, path)
  - description (string)
  - fit (string)
  - subCategory (string)
  - rating (number)

### Image Uploads
- Folder: `/public/uploads/`
- Max size: 5MB
- Allowed types: JPEG, JPG, PNG, GIF
- Files auto-deleted on error

### Session/Authentication
- Requires express-session with MongoDB store
- User must be logged in with role='admin'
- Session stored in MongoDB collection

### Error Handling
- All routes have try-catch blocks
- Meaningful error messages shown to admin
- File deleted if upload fails
- Redirects to safe pages on error

---

## 🔍 Validation Rules

### Frontend (JavaScript):
- Product Name: Required, 3-100 chars
- Price: Required, >= 0
- Category: Required, must select
- Stock: Required, >= 0
- Image: Required, valid file

### Backend (Node.js):
- All frontend checks repeated
- File type validation (MIME type)
- File size check (5MB max)
- Database schema validation
- Meaningful error messages

---

## 📦 Dependencies Used

```json
{
  "multer": "^1.4.5-lts.1",      // Image upload
  "express": "^4.22.2",           // Web framework
  "mongoose": "^7.8.9",           // Database
  "express-session": "^1.19.0",   // Session management
  "connect-mongo": "^6.0.0",      // Session store
  "connect-flash": "^0.1.1",      // Flash messages
  "ejs": "^3.1.10"                // Template engine
}
```

All already installed in your project!

---

## 🎨 UI/UX Features

- ✅ Professional form styling
- ✅ Image preview before upload
- ✅ Stock level color coding
- ✅ Beautiful confirmation modal
- ✅ Flash messages for feedback
- ✅ Responsive design
- ✅ Keyboard support (ESC, ENTER)
- ✅ Hover effects on buttons
- ✅ Loading states
- ✅ Error displays

---

## 🐛 Troubleshooting

**Q: Upload button not working?**
A: Check form has `enctype="multipart/form-data"`

**Q: Images not showing?**
A: Check `/public/uploads/` folder exists and files are there

**Q: Can't access /admin?**
A: Check you're logged in with admin role

**Q: Validation not working?**
A: Check browser console for JS errors, server logs for validation errors

**Q: Modal not appearing?**
A: Clear browser cache, check no JS errors

---

## 📞 Support Files

- Full implementation docs: `CRUD_IMPLEMENTATION.md`
- Routes code: `routes/admin.js`
- Dashboard view: `views/admin/dashboard.ejs`
- Forms: `views/admin/add-product.ejs`, `edit-product.ejs`

---

## ✨ Next Steps

1. **Test all features** using checklist above
2. **Add more fields** if needed (modify forms and Product model)
3. **Customize styling** in your admin.css
4. **Add bulk operations** (select multiple, bulk delete)
5. **Add search/filter** to dashboard
6. **Add product categories management**
7. **Add user roles** (Editor, Viewer, etc.)

---

Happy admin-ing! 🎉

**Created:** May 14, 2026
