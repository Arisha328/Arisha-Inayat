const express = require('express');
const path = require('path');

const app = express();

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

app.post('/contact-us', (req, res) => {
    console.log('Contact form submitted:', req.body);
    res.redirect('/contact-us');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});