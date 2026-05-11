const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// 1. Connect to MongoDB (Replace with your own connection string if needed)
// Using a local database named 'bookapi'
mongoose.connect('mongodb://localhost:27017/bookapi')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


// 2. Import the Mongoose Model
const Book = require('./models/book');


// 3. Define RESTful API Routes
const authorsRouter = require('./routes/authors');
app.use('/api/authors', authorsRouter);

// CREATE: Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    });
    
    const savedBook = await newBook.save();
    res.status(201).json(savedBook); // 201 Created
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 Bad Request
  }
});

// READ ALL: Get a list of all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books); // 200 OK by default
  } catch (err) {
    res.status(500).json({ error: err.message }); // 500 Internal Server Error
  }
});

// READ ONE: Get a specific book by its ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' }); // 404 Not Found
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Modify an existing book by its ID
app.put('/api/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Return the updated object and run schema validations
    );
    
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a book by its ID
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 4. Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
