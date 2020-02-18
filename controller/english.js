var db = require('../models');
var Promise = require('promise');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const axios = require('axios');
var config = require('../config.js');

module.exports = {
	get_word: async (req, res) => {
		if (!req.body.course_id) {
			return res.status(400).json({error: true, message: "Missing required parameter (course_id)."});
		}
		var count = await totalCount();
		var wordJson = [];
		var isAsked = false;
		let meaningString = '';
		console.log(count);
		do {
			console.log("in loop");
			wordJson = await getRandomWord(count);
			isAsked = await isAlreadyAnswered(wordJson._id, req.user_id, req.body.course_id);
		} while (isAsked);
		if (!wordJson.is_audio_available) {
			console.log('generate audio');
			await main(wordJson.word);
			const filter = {_id: wordJson._id};
			const update = {is_audio_available: true};
			await db.English.findOneAndUpdate(filter, update);
		}

		if(wordJson.meaning == ""){
			console.log('generate meaning');
			let meaning = await fetchMeaning(wordJson.word);
			if(meaning!="error"){
				meaning.forEach( (mean, index) => {
					if(index<3) {
						if (index > 0) {
							meaningString += '=> ';
						}
						meaningString += mean.definitions[0];
					}
				})
				console.log(meaningString);
				const filter = {_id: wordJson._id};
				const update = {meaning: meaningString};
				let doc = await db.English.findOneAndUpdate(filter, update);
			}
		}
		await db.Result.find({user_id: req.user_id, ques_id: wordJson._id, course_id: req.body.course_id}).then((resultRes) => {
			if (resultRes.length < 1) {
				const resultObj = new db.Result({
					ques_id: wordJson._id,
					user_id: req.user_id,
					course_id: req.body.course_id,
				});
				resultObj.save().then((resultRes1) => {
					return res.status(200).json({word: wordJson.word, meaning: meaningString, result_id: resultRes1._id});
				}).catch((err) => {
					return res.status(500).json({
						message: "Something went wrong",
						error: true
					});
				});
			} else if (resultRes.length > 0) {
				res.status(200).json({word: wordJson.word, meaning: meaningString, result_id: resultRes[0]._id});
			} else {
				return res.status(500).json({error: true, message: "Something went wrong."});
			}
		}).catch( err => {
			return res.status(500).json({
				message: "Something went wrong",
				error: true
			});
		})
	},
}

totalCount = async () => {
	return new Promise(resolve => {
		db.English.countDocuments().exec((err, count) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			resolve(count);
		});
	})
}

getRandomWord = async (count) => {
	// Get a random entry
	var random = Math.floor(Math.random() * count)
	return new Promise(resolve => {
		db.English.findOne().skip(random).exec((err, wordData) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			resolve(wordData);
		})
	})
}

isAlreadyAnswered = (questionId, userId, courseId) => {
	return new Promise(resolve => {
		db.Result.find({ user_id: userId, ques_id: questionId, course_id: courseId, is_answerd: true}).limit(1).exec((err, result) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			if(result.length>0){
				resolve(true);
			}else{
				resolve(false);
			}
		});
	})
}

main = async (word) => {
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

fetchMeaning = async (word) => {
	return new Promise(resolve => {
		axios.get(config.oxfordUrl + '/en-us/' + word, {
			params: {
				fields: 'definitions',
				strictMatch: true
			},
			headers: {
				Accept: 'application/json',
				app_id: config.appId,
				app_key: config.appKey
			}
		})
			.then(function (response) {
				resolve(response.data.results[0].lexicalEntries[0].entries[0].senses);
			})
			.catch(function (error) {
				//resolve(error);
				console.log('error');
				resolve('error');
			})
	})
}