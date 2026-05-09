const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./models/product');

const app = express();

// Connect to MongoDB
connectDB();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
// HOME ROUTE
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
    res.render('index');
});

// ─────────────────────────────────────────────
// HELPER: Build query string for pagination
// ─────────────────────────────────────────────
const buildQueryString = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value && value !== '' && value !== '0') {
            query.append(key, value);
        }
    });
    return query.toString();
};

// ─────────────────────────────────────────────
// PRODUCTS ROUTE  (Assignment 3)
// ─────────────────────────────────────────────
app.get('/products', async (req, res) => {
    try {
        const PAGE_SIZE = 8;

        // Query parameters
        const page       = parseInt(req.query.page)     || 1;
        const search     = req.query.search             || '';
        const category   = req.query.category           || '';
        const minPrice   = req.query.minPrice           || '';
        const maxPrice   = req.query.maxPrice           || '';
        const sortBy     = req.query.sortBy             || 'default';

        // Build filter object
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Build sort object
        const sortMap = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'rating': { rating: -1 },
            'name': { name: 1 },
            'default': { createdAt: -1 }
        };
        const sortObj = sortMap[sortBy] || sortMap['default'];

        // Count total matching docs
        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / PAGE_SIZE);
        const currentPage   = Math.max(1, Math.min(page, totalPages || 1));
        const skip          = (currentPage - 1) * PAGE_SIZE;

        // Fetch products
        const products = await Product.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(PAGE_SIZE);

        // Unique categories for the filter dropdown
        const categories = await Product.distinct('category');

        // Create helper function for view template
        const getFilteredUrl = (pageNum) => {
            return `/products?${buildQueryString({
                page: pageNum,
                search,
                category,
                minPrice,
                maxPrice,
                sortBy
            })}`;
        };

        res.render('products', {
            products,
            currentPage,
            totalPages,
            totalProducts,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy,
            categories,
            getFilteredUrl
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
