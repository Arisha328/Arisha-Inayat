const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');
const Product = require('./models/product');
const adminRouter = require('./routes/admin');

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
    cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));

app.use((req, res, next) => {
    res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact-us');
});

app.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('login', { error: req.query.error || '' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }

    return res.redirect('/login?error=' + encodeURIComponent('Invalid username or password.'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
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