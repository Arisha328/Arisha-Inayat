const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/Product');

const app = express();


// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Static Files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));


// Home Route
app.get('/', (req, res) => {
    res.render('index');
});


// Contact Route
app.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

app.post('/contact-us', (req, res) => {
    console.log(req.body);
    res.redirect('/contact-us');
});


// PRODUCTS ROUTE
app.get('/products', async (req, res) => {

    try {

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        // Filters
        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || 0;
        const maxPrice = req.query.maxPrice || 100000;

        let filter = {};

        // Search Filter
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Category Filter
        if (category) {
            filter.category = category;
        }

        // Price Filter
        filter.price = {
            $gte: Number(minPrice),
            $lte: Number(maxPrice)
        };

        // Fetch Products
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit);

        // Total Products
        const totalProducts = await Product.countDocuments(filter);

        // Total Pages
        const totalPages = Math.ceil(totalProducts / limit);

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            search,
            category,
            minPrice,
            maxPrice
        });

    } catch (error) {
        console.log(error);
    }

});


// Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});