// express package functions
const express = require("express");
// url routes
const routes = require("./controllers");
// database connections
const sequelize = require("./config/connection");

// helper functions for formatting dates, plural words, and url lengths
const helpers = require("./utils/helpers");

// express handlebars requirements
const path = require("path");
const exphbs = require("express-handlebars");
// pass the helpers and auth js files into exphbs.create for use in handlebars templates
const hbs = exphbs.create({ helpers, auth });

// cookies and sessions requirements
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  // this object gives the params for cookies
  secret: "Super secret secret", // this should be stored in .env
  cookie: {}, // to use cookies, declare "cookies: {},"
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// express locations to run server on local host (3001) or remote on heroku
const app = express();
const PORT = process.env.PORT || 3001;

// handlebars template engine connect to express
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// cookies and session connect to session, cookies, and use db
app.use(session(sess));

// middleware to translate to use json data format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(routes);

// turn on connection to db and then to the server
sequelize
  .sync({ force: false }) // force: true = DROP TABLE IF EXISTS
  .then(() => {
    app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}...`));
  });
