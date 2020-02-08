// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  secret: process.env.Secret,
  dbUrl: process.env.dbUrl,
};
