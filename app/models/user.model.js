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

//this should be in a stored procedure
// addFavourite
// User.addFavourite = (artist, song_name, result) => {
//    // sql.query(`SELECT id FROM music_entries WHERE artist = ${artist} AND song_name = ${song_name}`, (err, res) => { //get rid of song + artist name 
//         sql.query(`CALL addFavourite(${artist}, ${song_name})`, (err, data, _) => {

//         })
//     })
// }

//how to get user's id with just the username?
User.getFavourites = (user_name, result) => {

   // sql.query(`SELECT id FROM user WHERE user_name = ${user_name}`) //get id from user_name

}

module.exports = User;

 // conn.query(`CALL AddIngredient('${ingredName}')`, (err, data, _) => {
 