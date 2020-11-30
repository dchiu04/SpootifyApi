module.exports = app => {
  const music = require("../controllers/music.controller.js");

//WORKS:
	// Create a new Music 
	app.post("/music", music.create);

	// Retrieve all Music
	app.get("/music", music.findAll);

	// Retrieve all Music by artist
	app.get("/music/:artist", music.findAllByArtist);
	
	// Retrieves song with the same song name and artist
	app.get("/music/:artist/:song_name", music.findSong);

	// Updates any/all music attributes by artist and song name
	app.put("/music/:artist/:song_name", music.update);
	
	// Delete a Music entry with artist and song name
	app.delete("/music/:artist/:song_name", music.deleteSongByArtist);

	// Delete all Music by artist
	app.delete("/music/:artist", music.deleteAllByArtist);

	// Delete all music, clear database
	app.delete("/music", music.deleteAll);
};

/**
Missing End points (4):
- 2 POSTS (one of them should create many music objects to be sent)
- 2 more of any type
*/