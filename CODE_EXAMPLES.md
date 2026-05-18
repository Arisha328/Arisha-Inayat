# 💻 Code Examples & Reference

## Routes Overview

### Complete Admin Routes (`routes/admin.js`)

```javascript
// 🛠️ Dashboard: Read All Products
GET /admin
→ Display all products in table format
→ Shows: images, names, categories, prices, stock
→ Sorted by newest first

// ➕ Create: Add Product Form
GET /admin/add
→ Show blank form to enter product details
→ Form includes: name, price, category, stock, image, etc.

// ➕ Create: Process Add Product
POST /admin/add (with image file)
→ Validate all fields
→ Upload image to /public/uploads/
→ Save to MongoDB
→ Redirect to dashboard

// ✏️ Update: Edit Product Form
GET /admin/edit/:id
→ Load product by ID
→ Pre-fill form with current data
→ Show current product image

// ✏️ Update: Process Update
POST /admin/edit/:id (with optional image file)
→ Validate all fields
→ Upload new image if provided
→ Update MongoDB document
→ Keep existing image if not changed
→ Redirect to dashboard

// ❌ Delete: Remove Product
GET /admin/delete/:id
→ Delete product from MongoDB
→ Redirect to dashboard
```

---

## Multer Configuration Example

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    // Where to save files
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        
        // Create folder if doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    
    // How to name files
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + 
                          path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Validation rules
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Use in routes
router.post('/add', upload.single('image'), async (req, res) => {
    // req.file contains uploaded file info
    // req.file.filename = generated filename
    // req.file.path = full path to file
});
```

---

## Validation Examples

### Server-Side Validation (Node.js)

```javascript
// Add/Update Product Validation
if (!name || !name.trim()) {
    req.flash('error', 'Product name is required');
    return res.redirect('/admin/add');
}

if (!price || price < 0) {
    req.flash('error', 'Valid price is required');
    return res.redirect('/admin/add');
}

if (!category || category.trim() === '') {
    req.flash('error', 'Category is required');
    return res.redirect('/admin/add');
}

if (!stock || stock < 0) {
    req.flash('error', 'Valid stock quantity is required');
    return res.redirect('/admin/add');
}

if (!req.file) {
    req.flash('error', 'Product image is required');
    return res.redirect('/admin/add');
}
```

### Client-Side Validation (JavaScript)

```javascript
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').files[0];

    if (!name) {
        alert('⚠️ Product name is required!');
        return false;
    }
    
    if (!price || price < 0) {
        alert('⚠️ Valid price is required!');
        return false;
    }
    
    if (!stock || stock < 0) {
        alert('⚠️ Valid stock quantity is required!');
        return false;
    }
    
    if (!category) {
        alert('⚠️ Category is required!');
        return false;
    }
    
    if (!image) {
        alert('⚠️ Product image is required!');
        return false;
    }

    return true; // Form is valid
}
```

---

## Form Examples

### Add Product Form (Minimal)

```html
<form action="/admin/add" method="POST" enctype="multipart/form-data">
    
    <input 
        type="text" 
        name="name" 
        placeholder="Product name"
        required
    />
    
    <input 
        type="number" 
        name="price" 
        placeholder="Price"
        min="0"
        required
    />
    
    <select name="category" required>
        <option value="">Select</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Juniors">Juniors</option>
        <option value="Kids">Kids</option>
    </select>
    
    <input 
        type="number" 
        name="stock" 
        placeholder="Stock quantity"
        min="0"
        required
    />
    
    <input 
        type="file" 
        name="image"
        accept="image/*"
        required
    />
    
    <button type="submit">Save</button>
</form>
```

### Edit Product Form (Pre-filled)

```html
<form action="/admin/edit/<%= product._id %>" method="POST" enctype="multipart/form-data">
    
    <input 
        type="text" 
        name="name" 
        value="<%= product.name %>"
        required
    />
    
    <input 
        type="number" 
        name="price" 
        value="<%= product.price %>"
        min="0"
        required
    />
    
    <img src="<%= product.image %>" alt="Current image">
    
    <input 
        type="file" 
        name="image"
        accept="image/*"
    />
    <small>Leave empty to keep current image</small>
    
    <button type="submit">Update</button>
</form>
```

---

## JavaScript Examples

### Image Preview

```javascript
function previewImage() {
    const file = document.getElementById('image').files[0];
    const preview = document.getElementById('preview');
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" 
                     alt="Preview"
                     style="max-width: 200px;">
            `;
        };
        
        reader.readAsDataURL(file);
    }
}
```

### Delete Confirmation Modal

```javascript
let deleteProductId = null;

function showDeleteModal(productId, productName) {
    deleteProductId = productId;
    document.getElementById('deleteMessage').innerHTML = 
        `Are you sure you want to delete "<strong>${productName}</strong>"?`;
    document.getElementById('deleteModal').style.display = 'block';
}

function confirmDelete() {
    if (deleteProductId) {
        window.location.href = `/admin/delete/${deleteProductId}`;
    }
}

function closeModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteProductId = null;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('deleteModal');
    if (modal.style.display === 'block') {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'Enter') {
            confirmDelete();
        }
    }
});
```

---

## Database Examples

### Save Product (Create)

```javascript
const product = new Product({
    name: "T-Shirt Blue",
    price: 1500,
    category: "Men",
    stock: 50,
    image: "/uploads/1234567890-123456789.jpg",
    description: "High quality cotton shirt",
    fit: "Regular Fit",
    subCategory: "Formal",
    rating: 4
});

await product.save();
// Returns: Product object with _id
```

### Find All Products (Read)

```javascript
const products = await Product.find()
    .sort({ createdAt: -1 });
// Returns: Array of all products, sorted newest first
```

### Find One Product (Read)

```javascript
const product = await Product.findById(productId);
// Returns: Single product object or null
```

### Update Product (Update)

```javascript
const updateData = {
    name: "Updated Name",
    price: 2000,
    stock: 75
};

await Product.findByIdAndUpdate(productId, updateData, { new: true });
// Returns: Updated product object
```

### Delete Product (Delete)

```javascript
await Product.findByIdAndDelete(productId);
// Returns: Deleted product object or null
```

---

## Error Handling Examples

### Try-Catch Block

```javascript
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        // Validation
        if (!req.file) {
            throw new Error('Image is required');
        }

        // Create product
        const product = new Product({
            name: req.body.name,
            image: `/uploads/${req.file.filename}`
        });

        await product.save();

        req.flash('success', 'Product added successfully!');
        res.redirect('/admin');

    } catch (error) {
        console.error('Add product error:', error);
        
        // Clean up uploaded file
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        // Show error to user
        req.flash('error', 'Error: ' + error.message);
        res.redirect('/admin/add');
    }
});
```

---

## Flash Messages

### Set Flash Message

```javascript
// Success
req.flash('success', 'Product added successfully! ✨');

// Error
req.flash('error', 'Product name is required');

// Then redirect
res.redirect('/admin');
```

### Display Flash Message (in EJS)

```ejs
<% if (success && success.length > 0) { %>
    <div class="alert alert-success">
        ✓ <%= success %>
    </div>
<% } %>

<% if (error && error.length > 0) { %>
    <div class="alert alert-error">
        ✗ <%= error %>
    </div>
<% } %>
```

---

## Authentication Examples

### isAdmin Middleware

```javascript
const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }
    
    req.flash('error', 'Access denied. Admin privileges required.');
    res.redirect('/');
};
```

### Protected Route

```javascript
// All routes in this file are protected
router.use(isAdmin);

// Now only admins can access
router.get('/', (req, res) => {
    // This runs only for admins
});
```

---

## CSS Styling Examples

### Button Styles

```css
.button {
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #0056b3;
}

.button.delete {
    background-color: #dc3545;
}

.button.delete:hover {
    background-color: #c82333;
}
```

### Alert Styles

```css
.alert {
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
```

### Form Styles

```css
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
```

---

## Common Patterns

### Redirect After Success

```javascript
await Product.create(productData);
req.flash('success', 'Product added!');
res.redirect('/admin'); // Back to dashboard
```

### File Upload & Save Path

```javascript
const imagePath = `/uploads/${req.file.filename}`;
await Product.create({
    ...data,
    image: imagePath
});
```

### Optional Image Update

```javascript
const updateData = { ...req.body };

if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
}

await Product.findByIdAndUpdate(productId, updateData);
```

### Error Response

```javascript
if (!name || !name.trim()) {
    req.flash('error', 'Name required');
    return res.redirect('/admin/add');
}
```

---

## Testing Examples

### Test Add Product (in browser)

```
1. Go to: http://localhost:3000/admin/add
2. Fill form:
   - Name: "Test Product"
   - Price: 1500
   - Category: Men
   - Stock: 50
   - Upload image
3. Click "Save"
4. Check /public/uploads/ for image file
5. Check database for product
```

### Test API Response (with curl)

```bash
curl -X POST http://localhost:3000/admin/add \
  -F "name=Product" \
  -F "price=1500" \
  -F "category=Men" \
  -F "stock=50" \
  -F "image=@/path/to/image.jpg"
```

---

**Reference Version:** 1.0.0
**Last Updated:** May 14, 2026
