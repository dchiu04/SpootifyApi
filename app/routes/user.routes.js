module.exports = app => {
    const user = require("../controllers/user.controller.js");

//WORKS:
    //8. Create a new User
    app.post("/user", user.create);   

    //9. Post a new favorite
    app.post("/user/:user_name/:artist/:song_name", user.addFavourite);

    //10. Gets a user's favourites
    app.get("/user/:user_name", user.getFavourites);

    //11. Delete a single favourite
    app.delete("/user/:user_name/:artist/:song_name", user.delete);
    
    //12. Deletes a user
    app.delete("/user/:user_name/:password", user.deleteUser);
  };
  