module.exports = app => {
    const user = require("../controllers/user.controller.js");

//WORKS:
    //10. Create a new User
    app.post("/user", user.create);

    //11. Post a new favorite
    app.post("/user/:user_name/:artist/:song_name", user.addFavourite);

    //12. Gets a user's favourites
    app.get("/user/:user_name", user.getFavourites);

    //13. Delete a single favourite
    app.delete("/user/:user_name/:artist/:song_name", user.delete); //no message on success(works) and crashes on fails
    
    // Deletes a user
    app.delete("/user/:user_name/:password", user.deleteUser); //no message on fail and crashes
  };
  