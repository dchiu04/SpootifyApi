const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Spootify." });
});

require("./app/routes/music.routes.js")(app);

// set port, listen for requests
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000.");
});