const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/product');
const User = require('./models/user');

const products = [
    // MEN - T-Shirts & Polos
    { name: 'Embroidered Slogan Print T-Shirt', price: 4490, category: 'Men', subCategory: 'T-Shirts', rating: 4, stock: 50, fit: 'Regular Fit', image: '/images/p1.png' },
    { name: 'Cropped Graphic T-Shirt', price: 3290, category: 'Men', subCategory: 'T-Shirts', rating: 4, stock: 35, fit: 'Boxy Fit', image: '/images/p2.png' },
    { name: 'Cropped Slogan Polo', price: 4490, category: 'Men', subCategory: 'Polos', rating: 5, stock: 20, fit: 'Boxy Fit', image: '/images/p3.png' },
    { name: 'Graphic T-Shirt', price: 3290, category: 'Men', subCategory: 'T-Shirts', rating: 3, stock: 60, fit: 'Relaxed Fit', image: '/images/p4.png' },
    { name: 'Textured Crew-Neck T-Shirt', price: 4990, category: 'Men', subCategory: 'T-Shirts', rating: 4, stock: 40, fit: 'Regular Fit', image: '/images/p5.png' },
    { name: 'Sweater Knitted Polo', price: 5990, category: 'Men', subCategory: 'Polos', rating: 5, stock: 15, fit: 'Regular Fit', image: '/images/p6.png' },
    { name: 'Graphic T-Shirt Relaxed', price: 3290, category: 'Men', subCategory: 'T-Shirts', rating: 4, stock: 45, fit: 'Relaxed Fit', image: '/images/p7.png' },
    { name: 'Graphic T-Shirt Classic', price: 2890, category: 'Men', subCategory: 'T-Shirts', rating: 3, stock: 70, fit: 'Relaxed Fit', image: '/images/p8.png' },
    { name: 'Graphic T-Shirt Bold', price: 2890, category: 'Men', subCategory: 'T-Shirts', rating: 4, stock: 55, fit: 'Relaxed Fit', image: '/images/p9.png' },

    // WOMEN - T-Shirts & Tops
    { name: 'Cropped T-Shirt', price: 2890, category: 'Women', subCategory: 'T-Shirts', rating: 4, stock: 45, fit: 'Relaxed Fit', image: '/images/p23.png' },
    { name: 'Graphic T-Shirt Women', price: 2890, category: 'Women', subCategory: 'T-Shirts', rating: 3, stock: 60, fit: 'Relaxed Fit', image: '/images/p24.png' },
    { name: 'Cropped Striped Tank Top', price: 2290, category: 'Women', subCategory: 'Tops', rating: 5, stock: 30, fit: 'Slim Fit', image: '/images/p25.png' },
    { name: 'Cropped Striped T-Shirt', price: 2890, category: 'Women', subCategory: 'T-Shirts', rating: 4, stock: 25, fit: 'Regular Fit', image: '/images/p26.png' },
    { name: 'Embroidered T-Shirt Women', price: 3290, category: 'Women', subCategory: 'T-Shirts', rating: 4, stock: 35, fit: 'Relaxed Fit', image: '/images/p27.png' },
    { name: 'Super Cropped Slogan T-Shirt', price: 1890, category: 'Women', subCategory: 'T-Shirts', rating: 3, stock: 50, fit: 'Slim Fit', image: '/images/p28.png' },
    { name: 'Cropped Striped T-Shirt Relaxed', price: 2890, category: 'Women', subCategory: 'T-Shirts', rating: 4, stock: 40, fit: 'Relaxed Fit', image: '/images/p29.png' },
    { name: 'Slim Fit Striped T-Shirt', price: 2490, category: 'Women', subCategory: 'T-Shirts', rating: 5, stock: 20, fit: 'Slim Fit', image: '/images/p30.png' },

    // JUNIORS / KIDS - Girls
    { name: 'Character Graphic T-Shirt', price: 1690, category: 'Juniors', subCategory: 'T-Shirts', rating: 4, stock: 55, fit: 'Regular Fit', image: '/images/p35.png' },
    { name: 'Cropped Graphic T-Shirt Girls', price: 1890, category: 'Juniors', subCategory: 'T-Shirts', rating: 3, stock: 40, fit: 'Relaxed Fit', image: '/images/p36.png' },
    { name: 'Striped T-Shirt with Applique Detail', price: 2290, category: 'Juniors', subCategory: 'T-Shirts', rating: 5, stock: 30, fit: 'Relaxed Fit', image: '/images/p37.png' },
    { name: 'Cropped Blouse with Bow Detail', price: 2290, category: 'Juniors', subCategory: 'Tops', rating: 4, stock: 25, fit: 'Relaxed Fit', image: '/images/p38.png' },
    { name: 'Embellished T-Shirt Toddler', price: 2290, category: 'Kids', subCategory: 'T-Shirts', rating: 4, stock: 35, fit: 'Relaxed Fit', image: '/images/p39.png' },
    { name: 'Embellished T-Shirt Junior', price: 1890, category: 'Kids', subCategory: 'T-Shirts', rating: 3, stock: 45, fit: 'Regular Fit', image: '/images/p40.png' },
    { name: 'Cropped Graphic T-Shirt Toddler', price: 2090, category: 'Kids', subCategory: 'T-Shirts', rating: 5, stock: 20, fit: 'Relaxed Fit', image: '/images/p41.png' },
    { name: 'Cropped Graphic T-Shirt Junior', price: 2290, category: 'Kids', subCategory: 'T-Shirts', rating: 4, stock: 30, fit: 'Relaxed Fit', image: '/images/p42.png' },

    // Extra Men products
    { name: 'Classic Oxford Shirt', price: 6490, category: 'Men', subCategory: 'Shirts', rating: 5, stock: 25, fit: 'Regular Fit', image: '/images/p1.png' },
    { name: 'Slim Fit Chinos', price: 5990, category: 'Men', subCategory: 'Trousers', rating: 4, stock: 30, fit: 'Slim Fit', image: '/images/p2.png' },
    { name: 'Denim Jacket Men', price: 8990, category: 'Men', subCategory: 'Denim', rating: 5, stock: 15, fit: 'Regular Fit', image: '/images/p3.png' },

    // Extra Women products
    { name: 'Floral Midi Dress', price: 4990, category: 'Women', subCategory: 'Dresses', rating: 5, stock: 20, fit: 'Regular Fit', image: '/images/p24.png' },
    { name: 'High Waist Denim Skirt', price: 4490, category: 'Women', subCategory: 'Skirts', rating: 4, stock: 25, fit: 'Slim Fit', image: '/images/p25.png' },
];

const seedDB = async () => {
    await connectDB();
    try {
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing products and users...');

        // Seed products
        await Product.insertMany(products);
        console.log(`✅ Successfully seeded ${products.length} products!`);

        // Seed admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@outfitters.com',
            password: 'admin123', // This will be hashed by the pre-save middleware
            role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Successfully seeded admin user!');
        console.log('Admin credentials:');
        console.log('Email: admin@outfitters.com');
        console.log('Password: admin123');

        // Seed a regular customer user
        const customerUser = new User({
            name: 'John Doe',
            email: 'customer@example.com',
            password: 'password123',
            role: 'customer'
        });
        await customerUser.save();
        console.log('✅ Successfully seeded customer user!');
        console.log('Customer credentials:');
        console.log('Email: customer@example.com');
        console.log('Password: password123');

    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
