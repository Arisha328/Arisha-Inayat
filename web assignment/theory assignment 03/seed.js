const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB')
.then(() => console.log('MongoDB Connected'));

const products = [

    {
        name: 'iPhone 15',
        price: 250000,
        category: 'Electronics',
        rating: 4.8,
        stock: 10
    },

    {
        name: 'Samsung TV',
        price: 120000,
        category: 'Electronics',
        rating: 4.5,
        stock: 5
    },

    {
        name: 'Nike Shoes',
        price: 15000,
        category: 'Fashion',
        rating: 4.4,
        stock: 25
    },

    {
        name: 'Wooden Chair',
        price: 8000,
        category: 'Home',
        rating: 4.2,
        stock: 12
    },

    {
        name: 'Gaming Laptop',
        price: 300000,
        category: 'Electronics',
        rating: 4.9,
        stock: 7
    },

    {
        name: 'T-Shirt',
        price: 2500,
        category: 'Fashion',
        rating: 4.0,
        stock: 50
    },

    {
        name: 'Microwave Oven',
        price: 45000,
        category: 'Home',
        rating: 4.3,
        stock: 8
    },

    {
        name: 'Airpods',
        price: 35000,
        category: 'Electronics',
        rating: 4.7,
        stock: 20
    },

    {
        name: 'Jeans Pant',
        price: 4000,
        category: 'Fashion',
        rating: 4.1,
        stock: 30
    },

    {
        name: 'Sofa Set',
        price: 90000,
        category: 'Home',
        rating: 4.6,
        stock: 3
    },

    {
        name: 'Smart Watch',
        price: 25000,
        category: 'Electronics',
        rating: 4.4,
        stock: 15
    },

    {
        name: 'Hoodie',
        price: 5000,
        category: 'Fashion',
        rating: 4.3,
        stock: 18
    },

    {
        name: 'Dining Table',
        price: 70000,
        category: 'Home',
        rating: 4.5,
        stock: 4
    },

    {
        name: 'Bluetooth Speaker',
        price: 12000,
        category: 'Electronics',
        rating: 4.2,
        stock: 16
    },

    {
        name: 'Jacket',
        price: 8500,
        category: 'Fashion',
        rating: 4.5,
        stock: 11
    },

    {
        name: 'Bed',
        price: 65000,
        category: 'Home',
        rating: 4.4,
        stock: 6
    },

    {
        name: 'Keyboard',
        price: 4500,
        category: 'Electronics',
        rating: 4.1,
        stock: 22
    },

    {
        name: 'Cap',
        price: 1200,
        category: 'Fashion',
        rating: 4.0,
        stock: 40
    },

    {
        name: 'Lamp',
        price: 3500,
        category: 'Home',
        rating: 4.2,
        stock: 14
    },

    {
        name: 'Monitor',
        price: 55000,
        category: 'Electronics',
        rating: 4.6,
        stock: 9
    }

];

async function seedData() {

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log('Products Inserted');

    mongoose.connection.close();
}

seedData();