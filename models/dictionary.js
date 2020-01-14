var mongoose = require('mongoose');
const { Schema } = mongoose;

// mongoose.Promise = global.Promise; Inserted the bluebird module here to fix warnings described in app.js
mongoose.Promise = require('bluebird');

const dictionarySchema = new Schema({
  word: { type: String, required: true, unique: true },
  isaudioavailable: {type: Boolean, required: true, default: false}
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports =  Dictionary;