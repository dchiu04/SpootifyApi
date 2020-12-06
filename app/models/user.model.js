const sql = require("./db.js");

// Constructor
const User = function(user) {
  this.user_name = user.user_name;
  this.password = user.password;
};

//create
User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created User: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

 //addFavourite
User.addFavourite = (user_name, artist, song_name, result) => {
    //get user id, get song id, add both ids into favourites
    sql.query(`SELECT id FROM user WHERE user.user_name = '${user_name}'`, (err, idRes) => { //gets users id
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (idRes.length) {
            console.log("found id from user: ", idRes[0].id);
        }
        else {
            console.log("could not find id from user");
            result({ kind: "not_found" }, null);
            return;
        }
        console.log(idRes);
        sql.query(`SELECT id FROM music_entries WHERE artist = '${artist}' AND song_name = '${song_name}'`, (err, songIdRes) => { //gets song + artist id
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (songIdRes.length) {
                console.log("found id from music_entries: ", songIdRes[0].id);
            } else {
                console.log("could not find id from music_entries");
                result({ kind: "not_found" }, null);
                return;
            }
            sql.query(`INSERT IGNORE INTO favourites (user_id, music_entries_id) VALUES(${idRes[0].id}, ${songIdRes[0].id})`, (err, finalRes) => { //gets song id
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }
                
                if (finalRes.affectedRows == 0) {
                    // not found favourite
                    result({ kind: "not_found" }, null);
                    return;
                }
            
                console.log("Created favourite: ", { user_id: idRes[0].id, music_entries_id: songIdRes[0].id });
                result(null, { user_id: idRes[0].id, music_entries_id: songIdRes[0].id });  
            });
        });
    });
}

//getFavourites
User.getFavourites = (user_name, result) => {
    sql.query(`SELECT id FROM user WHERE user.user_name LIKE '${user_name}'`, (err, idRes) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (idRes.length) {
            console.log("found id: ", idRes);
        }
        else {
            console.log("idRes has no length, error: ", err);
            result({ kind: "not_found" }, null);
            return;
        }
        sql.query(`SELECT song_name, artist, genre, year FROM music_entries JOIN favourites on music_entries.id = favourites.music_entries_id WHERE favourites.user_id = '${idRes[0].id}'`, (err, songRes) =>{
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (songRes.affectedRows == 0) {
                // not found favourite
                result({ kind: "not_found" }, null);
                return;
            }
            //found favourites
            if (songRes.length) {
                console.log("found information: ", songRes);
                result(null, songRes);
                return;
            }
            //default is error_occurred
            result({ kind: "error_occurred" }, null);    
        });
    });
};


//delete
User.delete = (user_name, artist, song_name, result) => {
    //get user id, get song + artist id, delete from favourites when first and second id match
    sql.query(`SELECT id FROM user WHERE user.user_name LIKE '${user_name}'`, (err, idRes) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (idRes.length) {
            console.log("found id: ", idRes);
        }
        else {
            console.log("idRes has no length, error: ", err);
            result(null, err);   
            return;
        }
        console.log(idRes);
        sql.query(`SELECT id FROM music_entries WHERE artist = '${artist}' AND song_name = '${song_name}'`, (err, songIdRes) => { //gets song + artist id
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (idRes.length) {
                console.log("found id from song: ", songIdRes[0].id);
            }
            console.log(songIdRes); //user_id, music_entries_id
            sql.query(`DELETE FROM favourites WHERE user_id = '${idRes[0].id}' AND music_entries_id = '${songIdRes[0].id}'`, (err, res) => {
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
            console.log(res[0]);
            result(null, res[0]);
            });
        });
    });
};

module.exports = User;

 