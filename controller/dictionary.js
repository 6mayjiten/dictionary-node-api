var express = require('express');
var db = require('../models');
var Promise = require('promise');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

module.exports = {

	get_word: async function(req, res){
		var count = await totalCount();
		console.log(count);
		var wordJson = await getRandomWord(count);
		var isAsked = await isAlreadyAsked(wordJson.word);
		var i=0;
		while(i<10 && isAsked){
			console.log('in while loop');
			isAsked = await isAlreadyAsked(wordJson.word);
			i++;
		}
		if(!wordJson.isaudioavailable){
			console.log('generate audio');
			await main(wordJson.word);
			const filter = { _id: wordJson._id };
			const update = { isaudioavailable: true };
			var doc = await db.Dictionary.findOneAndUpdate(filter, update);
			console.log(doc);
		}
		let resultRes = await db.Result.find({ userid: 0, word: wordJson.word });
		console.log(resultRes);
		if(resultRes.length<1){
			const resultObj = new db.Result({
				word:wordJson.word,
				userId:0
			});
			await resultObj.save().then((resultRes1) => {
				console.log(resultRes1);
				return res.json({"word":wordJson.word,"result_id":resultRes1._id});
			}).catch((err) => {
				return res.status(500).json({
				  message: err,
				  error: true
				});
			});
		}else{
			res.json({"word":wordJson.word,"result_id":resultRes[0]._id});
		}
	},
	save_response: async function(req,res){
		var doc;
		const filter = { _id: req.body.resultId};
		if(!req.body.isRight){
			var result = await db.Result.findOne(filter);
			console.log("dasd "+result);
			var update={};
			if(result!=null){
				update = { wrongcount: result.wrongcount+1 };
			}
			doc = await db.Result.findOneAndUpdate(filter, update);
		}else{
			doc = await db.Result.findOneAndUpdate(filter, {isanswerd: true});
		}
		res.json({success:true});
	}
}

async function totalCount(){
	return new Promise(resolve => {
		db.Dictionary.countDocuments().exec((err, count) => {
			if (err) {
				res.send(err);
				return;
			}
			resolve(count);
		});
	})
}

async function getRandomWord(count){
	// Get a random entry
	var random = Math.floor(Math.random() * count)
	return new Promise(resolve => {
		db.Dictionary.findOne().skip(random).exec((err, wordData) => {
			if (err) {
				res.send(err);
				return;
			}
			console.log("1  "+wordData);
			resolve(wordData);
		})
	})
}

async function isAlreadyAsked(word){
	return new Promise(resolve => {
		db.Result.find({ word: word, isanswerd: true}).limit(1).exec((err, result) => {
			if (err) {
				res.send(err);
				return;
			}
			if(result.length>0){
				resolve(true);
			}else{
				resolve(false);
			}
		});
	})
}

async function main(word) {
  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();
  // Construct the request
  const request = {
    input: {text: word},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('./public/audio/'+word.toLowerCase()+'.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: '+word+'.mp3');
}
