module.exports = app => {
  	const music = require("../controllers/music.controller.js");
	var multer = require('multer')
	const ejs = require('ejs');
	const path = require('path');
	const express = require("express");
	// EJS
app.set('view engine', 'ejs');

// Public Folder
//app.use(express.static('./public'));

	// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
	  cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
  });
  
	// Init Upload
const upload = multer({	
	storage: storage,
	limits:{fileSize: 1000000},
	fileFilter: function(req, file, cb){
	  checkFileType(file, cb);
	}
  }).single('album_cover');

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
	app.post("/music/album", function(req, res) {
		upload(req, res, function(err) {
			if (err instanceof multer.MulterError) {
				console.log("Multer error");
			} else if (err) {
				console.log("Diff error", err);
			}
			//everything is fine
			//messsage = {""}
			console.log("it went through");
		})
	})
};
