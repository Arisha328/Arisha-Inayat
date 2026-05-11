const express = require('express');
const connectDB = require('./config/db');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API Running Successfully',
        endpoints: {
            products: '/api/v1/products',
            singleProduct: '/api/v1/products/:id',
            register: '/api/v1/auth/register',
            login: '/api/v1/auth/login',
            userProfile: '/api/v1/user/profile',
            createOrder: '/api/v1/orders',
            note: 'Use JWT Bearer token for protected routes'
        }
    });
});

app.use('/api/v1', apiRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});