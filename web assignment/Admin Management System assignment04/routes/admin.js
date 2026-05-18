const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const auth = require('../middleware/auth'); // Access Control Middleware

// 🖼️ Requirement: Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🔐 Requirement: Protect all admin routes
router.use(auth);

// 🛠️ Dashboard: Read All Products
router.get('/', async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { products });
});

// ➕ Create: Add Product Form
router.get('/add', (req, res) => res.render('admin/add-product'));

// ➕ POST: Process Add Product with Validation
router.post('/add', upload.single('image'), async (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock || !req.file) {
        return res.status(400).send("All fields, including stock and image, are required!");
    }

    await Product.create({
        name: name.trim(),
        price: Number(price),
        category,
        stock: Number(stock),
        image: `/uploads/${req.file.filename}`
    });
    res.redirect('/admin');
});

// ✏️ Update: Edit Product Form (Load Existing Data)
router.get('/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/edit-product', { product });
});

// ✏️ POST: Process Update
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    const updateData = { ...req.body };
    
    // Agar nayi image upload ki hai to path update karein
    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin');
});

// ❌ Delete: Remove Product with Confirmation logic
router.get('/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;