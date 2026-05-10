const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// CREATE: Add a new author
router.post('/', async (req, res) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      nationality: req.body.nationality,
      birthYear: req.body.birthYear
    });
    
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor); // 201 Created
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 Bad Request
  }
});

// READ ALL: Get a list of all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors); // 200 OK by default
  } catch (err) {
    res.status(500).json({ error: err.message }); // 500 Internal Server Error
  }
});

// READ ONE: Get a specific author by its ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' }); // 404 Not Found
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Modify an existing author by its ID
router.put('/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Return the updated object and run schema validations
    );
    
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove an author by its ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
