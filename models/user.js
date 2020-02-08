var mongoose = require('mongoose');
const { Schema } = mongoose;

// mongoose.Promise = global.Promise; Inserted the bluebird module here to fix warnings described in app.js
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports =  User;
