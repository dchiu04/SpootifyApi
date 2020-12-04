module.exports = app => {
  const music = require("../controllers/music.controller.js");

//WORKS:
	//1. Create a new Music 
	app.post("/music", music.create);
	
	//3. Updates specific song by artist and song name
	app.put("/music/song/:artist/:song_name", music.update);

	//4. Retrieve all Music
	app.get("/music", music.findAll);
	
	//5. Retrives all songs with the same name
	app.get("/music/song/:song_name", music.findSong);

	//6. Retrieve all Music by artist
	app.get("/music/artist/:artist", music.findAllByArtist);
	
	//7. Retrieves song with the same song name and artist
	app.get("/music/song/:artist/:song_name", music.findSongByArtist);
	
	//8. Delete a Music entry with artist and song name
	app.delete("/music/:artist/:song_name", music.deleteSongByArtist);

	//9. Delete all Music by artist
	app.delete("/music/:artist", music.deleteAllByArtist);

//IN PROGRESS:
	//2. Create a new album cover
	//app.post("/music", music.createAlbum);
};
