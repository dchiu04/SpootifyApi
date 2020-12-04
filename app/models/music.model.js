const sql = require("./db.js");

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
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created music: ", { id: res.insertId, ...newMusic });
    result(null, { id: res.insertId, ...newMusic });
  });
};

//findByArtistName
Music.findByArtistName = (artist, result) => {
  sql.query(`SELECT * FROM music_entries_entries WHERE artist = '${artist}'`, (err, res) => {
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
  sql.query(
    `UPDATE music_entries SET artist = ?, song_name = ?, genre = ?, album = ?, year = ? WHERE artist = '${artist}' AND song_name = '${song_name}'`,
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

//removeSong
Music.removeSong = (artist, song_name, result) => {
  sql.query(`DELETE FROM music_entries WHERE artist = '${artist}' AND song_name = '${song_name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted song with artist name: ", artist);
	console.log("deleted song: ", song_name);
    result(null, res);
  });
};

//removeArtist
Music.removeArtist = (artist, result) => {
	sql.query(`DELETE FROM music_entries WHERE artist = '${artist}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found artist with the artist
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted all music with artist name: ", artist);
    result(null, res);
  });
	
};

Music.removeAll = result => {
  sql.query("DELETE FROM music_entries", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} music`);
    result(null, res);
  });
};

module.exports = Music;