const express = require('express');
const path = require('path');

const app = express();

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set proper MIME types for static files
app.use((req, res, next) => {
    if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    } else if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    } else if (req.path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
    } else if (req.path.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
    }
    next();
});

// Static files - MUST be before routes
app.use(express.static(path.join(__dirname, 'public')));

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