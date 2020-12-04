const User = require("../models/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "User info cannot be empty!"
    });
  }

  // Create a User
  const user = new User({
    user_name: req.body.user_name,
    password: req.body.password
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
}

// Retrieve all Musics from the database.
exports.addFavorite = (req, res) => {
    User.addFavourite((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while adding favourite."
        });
      else res.send(data);
    });
  };

