//This contains the skeletal implementations for the routes which a general user can access.

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

//get the books available in the shop
const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

//register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (password && username) {
    // Check if the user does not already exist
    if (isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      res.status(200).json("Registration complete!Now you can login");
    } else {
      res.status(404).json({ message: "Unable to register user" });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    //res.send(JSON.stringify(books, null, 4));
    const booklist = await getBooks();
    res.json(booklist);
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: "Error retrieving booklist" });
  }
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    //use axios
    const isbn = req.params.isbn;
    const response = await axios.get("http://localhost:5050/${isbn}");
    res.json(response.data);
  } catch (error) {
    console.log("error fetching book details");
    res.status(404).json({ message: "can't get" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //promise
  const fetchBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    booksByAuthor = [];
    keys.forEach((key) => {
      const book = books[key];
      if (req.params.author.toLowerCase() === book.author.toLowerCase()) {
        booksByAuthor.push(book);
      }
    });
    //resolve
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("No books found for this author"));
    }
  });
  fetchBooksByAuthor
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(404).json({ message: "No books found for this author" });
    });
});

//   const keys = Object.keys(books);
//   booksByAuthor = [];
//   // Author name control
//   keys.forEach((key) => {
//     const book = books[key];
//     if (book.author.toLowerCase() === req.params.author.toLowerCase()) {
//       booksByAuthor.push(book);
//     }
//   });

//   if (booksByAuthor.length > 0) {
//     res.json(booksByAuthor);
//   } else {
//     res.send("No books found for this author");
//   }
// });

//Get all books based on title

//promise
public_users.get("/title/:title", function (req, res) {
  const fetchBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);

    BooksByTitle = [];
    keys.forEach((key) => {
      if (req.params.title.toLowerCase() === books[key].title.toLowerCase()) {
        const book = books[key];
        BooksByTitle.push(book);
      }
    });
    //resolve
    if (BooksByTitle.length > 0) {
      resolve(BooksByTitle);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
  fetchBooksByTitle
    .then((result) => {
      res.json(result);
    })
    .catch((error) =>
      res.status(404).json({ message: "No books found for this title" })
    );
});

//  public_users.get("/title/:title", function (req, res) {
//   const keys = Object.keys(books);
// const booksByTitle=[];
//  keys.forEach((key)=>{
//   const book=books[key];
//   if(book.title.toLowerCase()===req.params.title.toLowerCase()){
//      booksByTitle.push(book);
//    }
//  });
//  if(booksByTitle.length>0){
//    res.json(booksByTitle)
//  }
//  else{
//    res.send("No book was found with the specified name")
//  }
//  });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
