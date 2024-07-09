const express = require('express');
let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 2000)
    })
}


public_users.post("/register", (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    const allBooks = await getBooks();
    return res.send(JSON.stringify(allBooks, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const allBooks = await getBooks();
    if (allBooks[isbn]) {
        res.send(allBooks[isbn])
    }
    else {
        res.status(200).json({ message: `Book with ISBN ${isbn} was found` });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const allBooks = await getBooks();

    if (author) {
        const booksFiltered = Object.values(allBooks).filter(book => book.author === author)
        if (booksFiltered.length > 0) {
            res.send(booksFiltered)
        }
        else {
            res.status(200).json({ message: `Books with author provided not found` });
        }
    }
    else {
        res.send('please provide an author')
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const allBooks = await getBooks();

    if (title) {
        const booksFiltered = Object.values(allBooks).filter(book => book.title === title)
        if (booksFiltered.length > 0) {
            res.send(booksFiltered)
        }
        else {
            res.status(200).json({ message: `Books with title provided not found` });
        }
    }
    else {
        res.send('please provide a title')
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn]?.reviews;
    if (reviews) {
        res.send(reviews)
    } else {
        res.status(200).json({ message: `Books with isbn provided not found` });
    }

});

module.exports.general = public_users;
