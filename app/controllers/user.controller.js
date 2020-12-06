const User = require("../models/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body || !req.body.user_name || !req.body.password) {
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
    else res.status(200).send(data);
   //else res.send(data);
  });
}

// Adds a favourite Music to the user's favourite list stored on the database.
exports.addFavourite = (req, res) => {
    User.addFavourite(req.params.user_name, req.params.artist, req.params.song_name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while adding favourite."
        });
      else res.send(data);
    });
};

  // Retrieve all of the user's favourite Musics from the database.
exports.getFavourites = (req, res) => {
    User.getFavourites(req.params.user_name, (err, data) => {
      if (err)
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Cannot find any favourites for user: ${req.params.user_name}.`
          });
        } else {
          res.status(500).send({
            message: `Error retrieving favourites for user: ${req.params.user_name}`
          });
      } else res.send(data);
    });
};

// Delete a favourite Music from the user's favourite list
exports.delete = (req, res) => {
    User.delete(req.params.user_name, req.params.artist, req.params.song_name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while deleting favourite."
        });
      else res.send(data);
    });
};

// Deletes a user when given their username and password
exports.deleteUser = (req, res) => {
  User.deleteUser(req.params.user_name, req.params.password, (err, data) => {
    if (err)
      if (err.kind == "null") {
        res.status(404).send({
          message: err.message || "User could not be deleted. Please recheck your credentials."
        })
      }
      else res.status(500).send({
        message:
          err.message || "Some error occurred while deleting user."
      });
    else res.send(data);
  });
};