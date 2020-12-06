const sql = require("./db.js");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// Constructor
const Music = function(music) {
  this.artist = music.artist;
  this.song_name = music.song_name;
  this.genre = music.genre;
  this.album = music.album;
  this.year = music.year;
};

//create
Music.create = (newMusic, result) => {
  sql.query("INSERT INTO music_entries SET ?", newMusic, (err, res) => {
  //sql.query(`INSERT IGNORE INTO music_entries VALUES('${newMusic.song_name}','${newMusic.artist}','${newMusic.genre}','${newMusic.year}','${newMusic.album}')`,(err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created music: ", { id: res.insertId, ...newMusic });
    result(null, { id: res.insertId, ...newMusic });
  });
};

//create album
Music.createAlbum = (result) => {
  console.log("Result:", result);
};


//findByArtistName
Music.findByArtistName = (artist, result) => {
  sql.query(`SELECT * FROM music_entries WHERE artist = '${artist}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found song(s): ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

//findBySongName
Music.findBySongName = (song_name, result) => {
  sql.query(`SELECT * FROM music_entries WHERE song_name = '${song_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found song(s): ", res);
      result(null, res);
      return;
    }
    console.log(res);
    result({ kind: "not_found" }, null);
  });
};

//findByArtistSongName
Music.findByArtistSongName = (artist, song_name, result) => {
  sql.query(`SELECT * FROM music_entries WHERE artist = '${artist}' AND song_name = '${song_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found song: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

//getAll
Music.getAll = result => {
  sql.query("SELECT * FROM music_entries", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("music: ", res);
    result(null, res);
  });
};

//Update
Music.update = (artist, song_name, m, result) => {
  sql.query(`UPDATE music_entries SET artist = ?, song_name = ?, genre = ?, album = ?, year = ? WHERE artist = '${artist}' AND song_name = '${song_name}'`,
    [m.artist, m.song_name, m.genre, m.album, m.year],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated music: ", { artist: artist, ...m });
      result(null, { artist: artist, ...m });
    }
  );
};
/**
 * 
   {SELECT @song_id := id FROM music_entries WHERE artist = artist1 AND song_name = song_name1;
    DELETE FROM favourites WHERE music_entries_id = @song_id;
    DELETE FROM music_entries WHERE id = @song_id;} artist 
 */

// Music.removeSong = (artist, song_name, result) => {
//     //get user id, get song + artist id, delete from favourites when first and second id match
//     sql.query(`SELECT id FROM music_entries WHERE artist = '${artist}' AND song_name = '${song_name}'`, (err, idRes) => {
//       if (err) {
//           console.log("error: ", err);
//           result(null, err);
//           return;
//       }
//       if (idRes.length) {
//           console.log("found id: ", idRes);
//       }
//       else {
//           console.log("idRes has no length in remove song, error: ", err);
//           result(null, err);   
//           return;
//       }
//       sql.query(`DELETE FROM favourites WHERE music_entries_id = ${idRes[0].id}`, (err, favRes) => { //deletes all from favourites
//           if (err) {
//               console.log("error: ", err);
//               result(null, err);
//               return;
//           }
//           if (favRes.length) {
//               console.log("deleted from favourites: ", favRes);
//               console.log("deleted from favourites: ", favRes[0]);
//           }
//           sql.query(`DELETE FROM music_entries WHERE id = '${idRes[0].id}'`, (err, res) => {
//           if (err) {
//               console.log("error: ", err);
//               result(null, err);
//               return;
//           }
//           if (res.affectedRows == 0) {
//               result({ kind: "not_found" }, null);
//               return;
//           }
//           console.log("deleted song with artist name: ", artist);
//           console.log("deleted song: ", song_name);
//           console.log(res[0]);
//           result(null, res[0]);
//           });
//       });
//   });
// }
//removeSong
Music.removeSong = (artist, song_name, result) => {
  sql.query(`CALL delete_song_by_artist_song_name('${artist}', '${song_name}')`, (err, res) => {
    console.log("res:",res[0]);
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res[0].length == 0) {
      console.log("it didnt get deleted...");
      result({ kind: "not_found" }, null);
      return;
    } 
    console.log("deleted song with artist name: ", artist);
	  console.log("deleted song: ", song_name);
    result(null, res);
  });
};

module.exports = Music;
/** old delete_all_by_artist
 * CREATE DEFINER=`admin`@`%` PROCEDURE `delete_all_by_artist`(artist1 VARCHAR(255))
BEGIN
	SELECT @song_id := id FROM music_entries WHERE artist = artist1;
    DELETE FROM favourites WHERE music_entries_id = @song_id;
    DELETE FROM music_entries WHERE id = @song_id;
END
 */