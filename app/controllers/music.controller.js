const Music = require("../models/music.model.js");

// Create and Save a new Music
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  // Create a Music
  const music = new Music({
    artist: req.body.artist,
    song_name: req.body.song_name,
    genre: req.body.genre,
	album: req.body.album,
	year: req.body.year
  });

  // Save Music in the database
  Music.create(music, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Music."
      });
      else res.status(200).send(data);
    // else res.send(data);
  });
}

// Album cover upload
exports.createAlbum = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  // Save Music in the database
  Music.createAlbum((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while uploading the album cover."
      });
    else res.send(data);
  });
}

// Retrieve all Musics from the database.
exports.findAll = (req, res) => {
  Music.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving music."
      });
    else res.send(data);
  });
};

// Find all Music with the same song name
exports.findSong = (req, res) => {
  let song_name = req.params.song_name;
  Music.findBySongName(song_name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Music with song ${song_name}.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving Music with song ${song_name}`
        });
      }
    } else res.send(data);
  });
};

// Find all Music with the same song name and artist
exports.findSongByArtist = (req, res) => {
  Music.findByArtistSongName(req.params.artist, req.params.song_name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found ${req.params.song_name}` + ` with artist ${req.params.artist}.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving ${req.params.song_name} with artist ${req.params.artist}`
        });
      }
    } else res.send(data);
  });
};

// Find all Music with by the same artist
exports.findAllByArtist = (req, res) => {
  Music.findByArtistName(req.params.artist, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Music with artist ${req.params.artist}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Music with artist " + req.params.artist
        });
      }
    } else res.send(data);
  });
};

// Update a Music identified by the artist and song name in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Music.update(
    req.params.artist,
  	req.params.song_name,
    new Music(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Music with artist ${req.params.artist}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Music with artist name " + req.params.artist
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a single song with the specified artist and song anme in the request
exports.deleteSongByArtist = (req, res) => {
  Music.removeSong(req.params.artist, req.params.song_name, (err, data) => {
    console.log("err insdie fnc:", err);
    if (err) {
      if (err == "null") {
          res.status(404).send({
          message: err.message || "Music could not be deleted. Please double check the artist and song name"
        })
      }
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Music with id ${req.params.artist}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Music with artist " + req.params.artist + " and song name " + req.params.song_name
        });
      }
    } else res.send({ message: `Single song was deleted successfully!` });
  });
};
