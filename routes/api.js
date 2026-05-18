const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const { verifyToken, generateToken } = require('../middleware/jwt');

// ─────────────────────────────────────────────
// 🔓 PUBLIC ROUTES - No Authentication Needed
// ─────────────────────────────────────────────

/**
 * GET /api/products
 * Get all products with optional filtering
 * Query params: category, search, sortBy, page, limit
 */
router.get('/products', async (req, res) => {
    try {
        const { category, search, sortBy = 'default', page = 1, limit = 10 } = req.query;
        const filter = {};

        if (category && category !== '') {
            filter.category = category;
        }

        if (search && search.trim() !== '') {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        let sortOption = { createdAt: -1 };
        if (sortBy === 'price-asc') sortOption = { price: 1 };
        if (sortBy === 'price-desc') sortOption = { price: -1 };
        if (sortBy === 'rating') sortOption = { rating: -1 };
        if (sortBy === 'name') sortOption = { name: 1 };

        const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));
        const currentPage = Math.max(1, Number(page) || 1);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / pageSize);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .select('_id name price category stock image rating fit subCategory description');

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage,
                    pageSize,
                    totalProducts,
                    totalPages
                }
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
});

/**
 * GET /api/products/:id
 * Get single product details by ID
 */
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product details'
        });
    }
});

// ─────────────────────────────────────────────
// 🔐 AUTHENTICATION ROUTES
// ─────────────────────────────────────────────

/**
 * POST /api/auth/login
 * User login - returns JWT token
 * Body: { email, password }
 */
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id, user.email, user.role);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

/**
 * POST /api/auth/register
 * User registration
 * Body: { name, email, password, confirmPassword }
 */
router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: 'customer'
        });

        await user.save();

        const token = generateToken(user._id, user.email);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// ─────────────────────────────────────────────
// 🔐 PROTECTED ROUTES - Authentication Required
// ─────────────────────────────────────────────

/**
 * GET /api/user/profile
 * Get current logged-in user profile
 * Requires: Authorization header with Bearer token
 */
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

/**
 * POST /api/orders
 * Create a new order
 * Requires: Authorization header with Bearer token
 * Body: { items, customer: { name, email, address, phone }, total }
 */
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items, customer, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        if (!customer || !customer.name || !customer.email || !customer.address || !customer.phone) {
            return res.status(400).json({
                success: false,
                message: 'Complete customer information is required'
            });
        }

        if (!total || total <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order total'
            });
        }

        const order = new Order({
            user: req.user.userId,
            customer: {
                name: customer.name.trim(),
                email: customer.email.toLowerCase().trim(),
                address: customer.address.trim(),
                phone: customer.phone.trim()
            },
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                image: item.image,
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 0
            })),
            total: Number(total) || 0,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: {
                orderId: order._id,
                total: order.total,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error placing order'
        });
    }
});

/**
 * GET /api/orders
 * Get all orders for current logged-in user
 * Requires: Authorization header with Bearer token
 */
router.get('/orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .sort({ createdAt: -1 })
            .select('_id customer total status createdAt');

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

/**
 * GET /api/orders/:id
 * Get single order details
 * Requires: Authorization header with Bearer token
 */
router.get('/orders/:id', verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details'
        });
    }
});

/**
 * GET /api/onsale-products
 * Get all on-sale products (shirts specifically)
 * Query params: limit (optional, default: all)
 */
router.get('/onsale-products', async (req, res) => {
    try {
        const { limit } = req.query;
        let query = Product.find({
            isOnSale: true
        });

        if (limit) {
            query = query.limit(Number(limit));
        }

        const products = await query
            .sort({ createdAt: -1 })
            .select('_id name price category stock image rating fit subCategory description isOnSale');

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get onsale products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching on-sale products'
        });
    }
});

module.exports = router;
