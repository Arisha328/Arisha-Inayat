const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Juniors', 'Kids']
    },
    subCategory: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    stock: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: '/images/placeholder.png'
    },
    fit: {
        type: String,
        default: 'Regular Fit'
    },
    description: {
        type: String,
        default: ''
    },
    isOnSale: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
