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
                result(null, {user_id: idRes[0].id, music_entries_id: songIdRes[0].id });  
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
        sql.query(`CALL list_favourites(${idRes[0].id})`, (err, favRes) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (favRes.affectedRows == 0) {
                // not found favourite
                result({ kind: "not_found" }, null);
                return;
            }
            //found favourites
            if (favRes.length) {
                console.log("found information: ", favRes[0]);
                result(null, favRes[0]);
                return;
            }
            
            //default is error_occurred
            result({ kind: "error_occurred" }, null);    
        });
    });
};

User.delete = (user_name, artist, song_name, result) => {
    sql.query(`CALL delete_song_from_favourite('${user_name}', '${artist}', '${song_name}')`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("idRes: ", res[0]);
        if (res[0].length == 0) {
           // console.log("found id: ", idRes);
            result({message: "Couldn't find song"}, null);
            return;
        }
        console.log("deleted song with artist name: ", artist);
        console.log("deleted song: ", song_name);
        console.log(res[0]);
        result({message: "Favourite has been deleted successfully."}, null);  
    })
}

//deletes a user
User.deleteUser = (user_name, password, result) => {
    //select user id using username and password, delete them from favourites, delete them from user
    sql.query(`SELECT id FROM user WHERE user.user_name = '${user_name}' AND user.password = '${password}'`, (err, idRes) => {
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
            result({message: "Could not find user id"}, err);   
            return;
        }
        sql.query(`DELETE FROM favourites WHERE user_id = '${idRes[0].id}'`, (err, favRes) => { //gets song + artist id
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (favRes.length) {
                console.log("deleted user from favourites: ", user_name);
            }
            sql.query(`DELETE FROM user WHERE id = '${idRes[0].id}' AND user_name = '${user_name}' AND password = '${password}'`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            console.log("res affect:", res.affectedRows);
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("deleted user with user_name: ", user_name);
            console.log(res);
            result(null, {Deleted: user_name });
            });
        });
    });
};

module.exports = User;

 