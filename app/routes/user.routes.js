module.exports = app => {
    const user = require("../controllers/user.controller.js");

//WORKS:
    //10. Create a new User
    app.post("/user", user.create);

//IN PROGRESS:
    //11. Post a new favorite
    //app.post("/user/:artist/:song_name", user.addFavorite);

    //12. Delete a single favourite
	//app.delete("/user/:song_name", user.delete);
  };
  