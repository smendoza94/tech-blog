// import the local sequilize constructor from the sequelize library
const Sequelize = require("sequelize");

// use credentials from hidden .env file
require("dotenv").config();

// create a local conneciton to our database, pass in your
// MYSQL information for username and password
let sequelize;

// JAWDB is Heroku's online database, independent from local SQL database
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: "localhost",
      dialect: "mysql",
      port: 3306,
    }
  );
}

module.exports = sequelize;
