// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  secret: process.env.secret,
  oxfordUrl: process.env.oxfordUrl,
  appId: process.env.appId,
  appKey: process.env.appKey,
  dbUrl: process.env.dbUrl,
};
