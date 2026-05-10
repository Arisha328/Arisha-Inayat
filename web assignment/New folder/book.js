const mongoose = require('mongoose');

// Define a Mongoose Schema and Model
// We will create a simple 'Book' model
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
