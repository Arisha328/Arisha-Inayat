const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const { isAdmin } = require('../middleware/auth');

// 🖼️ Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        // Folder banao agar nahi ho
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

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
        }
    }
});

// 🔐 Protect all admin routes - Login required
router.use(isAdmin);

// 🛠️ Dashboard: Read All Products
router.get('/', async (req, res) => {
    try {
<<<<<<< HEAD
        const products = await Product.find().sort({ createdAt: -1 }) || [];
=======
        const products = await Product.find().sort({ createdAt: -1 });
>>>>>>> 68abda7251c7db28e7759766c67943d61c93aae0
        res.render('admin/dashboard', { products });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/');
    }
});

// ➕ Create: Add Product Form
router.get('/add', (req, res) => {
    res.render('admin/add-product');
});

// ➕ Alias: Add Product Form (requested route)
router.get('/add-product', (req, res) => {
    res.render('admin/add-product');
});

// ➕ POST: Process Add Product with Validation
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, stock, description, fit, subCategory, rating } = req.body;

        // ✅ Validation - Empty field check
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

        // ✅ Create product
        const product = new Product({
            name: name.trim(),
            price: Number(price),
            category,
            stock: Number(stock),
            image: `/uploads/${req.file.filename}`,
            description: description ? description.trim() : '',
            fit: fit ? fit.trim() : 'Regular Fit',
            subCategory: subCategory ? subCategory.trim() : '',
            rating: rating ? Math.min(5, Math.max(1, Number(rating))) : 3
        });

        await product.save();

        req.flash('success', `Product "${product.name}" added successfully! ✨`);
        res.redirect('/admin');

    } catch (error) {
        console.error('Add product error:', error);
        // Delete uploaded file if error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        req.flash('error', 'Error adding product: ' + error.message);
        res.redirect('/admin/add');
    }
});

// ➕ Alias: Process Add Product from /admin/add-product
router.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, stock, description, fit, subCategory, rating } = req.body;

        if (!name || !name.trim()) {
            req.flash('error', 'Product name is required');
            return res.redirect('/admin/add-product');
        }
        if (!price || price < 0) {
            req.flash('error', 'Valid price is required');
            return res.redirect('/admin/add-product');
        }
        if (!category || category.trim() === '') {
            req.flash('error', 'Category is required');
            return res.redirect('/admin/add-product');
        }
        if (!stock || stock < 0) {
            req.flash('error', 'Valid stock quantity is required');
            return res.redirect('/admin/add-product');
        }
        if (!req.file) {
            req.flash('error', 'Product image is required');
            return res.redirect('/admin/add-product');
        }

        const product = new Product({
            name: name.trim(),
            price: Number(price),
            category,
            stock: Number(stock),
            image: `/uploads/${req.file.filename}`,
            description: description ? description.trim() : '',
            fit: fit ? fit.trim() : 'Regular Fit',
            subCategory: subCategory ? subCategory.trim() : '',
            rating: rating ? Math.min(5, Math.max(1, Number(rating))) : 3
        });

        await product.save();

        req.flash('success', `Product "${product.name}" added successfully! ✨`);
        res.redirect('/admin');

    } catch (error) {
        console.error('Add product error:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        req.flash('error', 'Error adding product: ' + error.message);
        res.redirect('/admin/add-product');
    }
});

// ✏️ Update: Edit Product Form (Load Existing Data)
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin');
        }

        res.render('admin/edit-product', { product });
    } catch (error) {
        console.error('Edit form error:', error);
        req.flash('error', 'Error loading product');
        res.redirect('/admin');
    }
});

// ✏️ Alias: Edit Product Form (requested route)
router.get('/edit-product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin');
        }

        res.render('admin/edit-product', { product });
    } catch (error) {
        console.error('Edit form error:', error);
        req.flash('error', 'Error loading product');
        res.redirect('/admin');
    }
});

// ✏️ POST: Process Update Product
router.post(['/edit/:id', '/edit-product/:id'], upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, stock, description, fit, subCategory, rating } = req.body;

        // ✅ Validation
        if (!name || !name.trim()) {
            req.flash('error', 'Product name is required');
            return res.redirect(`/admin/edit/${req.params.id}`);
        }
        if (!price || price < 0) {
            req.flash('error', 'Valid price is required');
            return res.redirect(`/admin/edit/${req.params.id}`);
        }
        if (!category || category.trim() === '') {
            req.flash('error', 'Category is required');
            return res.redirect(`/admin/edit/${req.params.id}`);
        }
        if (!stock || stock < 0) {
            req.flash('error', 'Valid stock quantity is required');
            return res.redirect(`/admin/edit/${req.params.id}`);
        }

        // ✅ Prepare update data
        const updateData = {
            name: name.trim(),
            price: Number(price),
            category,
            stock: Number(stock),
            description: description ? description.trim() : '',
            fit: fit ? fit.trim() : 'Regular Fit',
            subCategory: subCategory ? subCategory.trim() : '',
            rating: rating ? Math.min(5, Math.max(1, Number(rating))) : 3
        };

        // Agar nayi image upload ki hai
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin');
        }

        req.flash('success', `Product "${product.name}" updated successfully! ✏️`);
        res.redirect('/admin');

    } catch (error) {
        console.error('Update product error:', error);
        // Delete uploaded file if error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        req.flash('error', 'Error updating product: ' + error.message);
        res.redirect(`/admin/edit/${req.params.id}`);
    }
});

// ❌ Delete: Remove Product
router.get('/delete/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin');
        }

        req.flash('success', `Product "${product.name}" deleted successfully! ✓`);
        res.redirect('/admin');

    } catch (error) {
        console.error('Delete product error:', error);
        req.flash('error', 'Error deleting product: ' + error.message);
        res.redirect('/admin');
    }
});

module.exports = router;