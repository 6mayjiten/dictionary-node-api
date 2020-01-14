var mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const resultSchema = new Schema({
  userid: {type: String, required: true, default: 0},
  word: { type: String, required: true, unique: true },
  wrongcount:{type: Number, required: true, default: 0},
  isanswerd: {type: Boolean, required: true, default: false}
});

const Result = mongoose.model('Result', resultSchema);

module.exports =  Result;