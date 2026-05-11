const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./models/product');
const User = require('./models/user');
const adminRouter = require('./routes/admin');
const { isLoggedIn } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'outfitters-secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/outfitters'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isLoggedIn = Boolean(req.session && req.session.userId);
    res.locals.isAdmin = Boolean(req.session && req.session.role === 'admin');
    res.locals.user = req.session ? req.session.user : null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact-us');
});

// Protected route example - checkout page
app.get('/checkout', isLoggedIn, (req, res) => {
    res.render('checkout', { user: req.session.user });
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    }
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Set session
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect(user.role === 'admin' ? '/admin' : '/');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    }
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long');
            return res.redirect('/register');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            req.flash('error', 'Email is already registered');
            return res.redirect('/register');
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: 'customer' // Default role
        });

        await user.save();

        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) { // Duplicate key error
            req.flash('error', 'Email is already registered');
        } else {
            req.flash('error', 'An error occurred during registration');
        }
        res.redirect('/register');
    }
});

app.get('/logout', (req, res) => {
    req.flash('success', 'You have been logged out successfully');
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

app.get('/products', async (req, res) => {
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

        const categories = ['Men', 'Women', 'Juniors', 'Kids'];

        const getFilteredUrl = (targetPage) => {
            const query = {
                category: category || '',
                search: search || '',
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                sortBy: sortBy || 'default',
                page: targetPage
            };
            const urlParams = Object.entries(query)
                .filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            return `/products?${urlParams}`;
        };

        res.render('products', {
            products,
            title: category ? `${category}'s Collection` : 'All Products',
            search: search || '',
            category: category || '',
            categories,
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            sortBy,
            totalProducts,
            currentPage,
            totalPages,
            getFilteredUrl
        });
    } catch (err) {
        console.log('Error filtering products:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});