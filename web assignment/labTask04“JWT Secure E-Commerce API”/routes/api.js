const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { user_id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Auth routes
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: role === 'admin' ? 'admin' : 'customer'
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Products routes
router.get('/products', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sortBy = 'default', page = 1 } = req.query;
        const filter = {};

        if (category && category !== '') {
            filter.category = category;
        }

        if (search && search.trim() !== '') {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        if (minPrice) {
            filter.price = { ...filter.price, $gte: Number(minPrice) || 0 };
        }

        if (maxPrice) {
            filter.price = { ...filter.price, $lte: Number(maxPrice) || 0 };
        }

        let sortOption = { createdAt: -1 };
        if (sortBy === 'price-asc') sortOption = { price: 1 };
        if (sortBy === 'price-desc') sortOption = { price: -1 };
        if (sortBy === 'rating') sortOption = { rating: -1 };
        if (sortBy === 'name') sortOption = { name: 1 };

        const pageSize = 8;
        const currentPage = Math.max(1, Number(page) || 1);
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        res.json({
            products,
            pagination: {
                currentPage,
                totalPages,
                totalProducts,
                pageSize
            },
            filters: {
                category: category || '',
                search: search || '',
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                sortBy
            }
        });
    } catch (err) {
        console.log('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (err) {
        console.log('Error fetching product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Protected routes
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        res.json({
            message: 'Order received',
            order: {
                user_id: req.user.user_id,
                role: req.user.role,
                items: items || [],
                shippingAddress: shippingAddress || null,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: 'An error occurred while creating order' });
    }
});

module.exports = router;