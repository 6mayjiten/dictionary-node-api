var mongoose = require('mongoose');
const { Schema } = mongoose;

// mongoose.Promise = global.Promise; Inserted the bluebird module here to fix warnings described in app.js
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

module.exports =  User;