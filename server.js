const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.header('Content-Type', 'application/json');
  next();
});

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Spootify." });
});

require("./app/routes/music.routes.js")(app);
require("./app/routes/user.routes.js")(app);

// set port, listen for requests
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000.");
});

