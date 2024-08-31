//This contains the skeletal implementations for the routes which an authorized user can access.

const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  // Filtering the users array for any user with the same username
  let UserWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (UserWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
  //returns boolean
  //check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Error log in" });
  } else if (authenticatedUser(username, password)) {
    // Generating JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User succesfully logged in!!" });
  } else {
    res
      .status(208)
      .json({ message: "Invalid Login check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const newReview = req.query.reviews;
  const username = req.session.authorization.username;
  //if(!books[isbn]){res.send("book not found")}
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = newReview;
    res.send("Review updated");
  } else {
    books[isbn].reviews = newReview;
    res.send("user review added");
  }
});
//Delete  a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.send("review deleted");
  } else {
    res.send("Review not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
