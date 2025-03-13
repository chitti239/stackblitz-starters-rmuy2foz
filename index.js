const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());

const data = require("./data.json");
let books = [...data]; 


app.post("/books", (req, res) => {
    try {
        const { book_id, title, author, genre, year, copies } = req.body;

        if (!book_id || !title || !author || !genre || !year || !copies) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (books.find(book => book.book_id === book_id)) {
            return res.status(400).json({ message: "Book ID already exists." });
        }

        const newBook = { book_id, title, author, genre, year, copies };
        books.push(newBook);

        res.status(201).json({ msg: "Successful", newBook });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});

// Retrieve all books
app.get("/books", (req, res) => {
    try {
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});

// Retrieve a book by ID
app.get("/books/:id", (req, res) => {
    try {
        const book = books.find(b => b.book_id == req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});

// Update a book by ID
app.put("/books/:id", (req, res) => {
    try {
        const index = books.findIndex(b => b.book_id == req.params.id);

        if (!index) {
            return res.status(404).json({ message: "Book not found." });
        }

        books[index] = { msg:"Book updated",...books[index], ...req.body };

        res.json(books[index]);
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});

// Delete a book by ID
app.delete("/books/:id", (req, res) => {
    try {
        const newBooks = books.filter(b => b.book_id != req.params.id);

        if (newBooks.length === books.length) {
            return res.status(404).json({ message: "Book not found." });
        }

        books = newBooks;
        res.json({ message: "Book deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred.", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
