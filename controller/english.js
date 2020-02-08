var db = require('../models');
var Promise = require('promise');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

module.exports = {
    get_word: async function(req, res, next){
        if(!req.body.course_id){
            return res.status(400).json({error:true,message:"Missing required paramete (courseId)."});
        }
        var count = await totalCount();
        console.log(count);
        var wordJson=[];
        var isAsked=false;
        do {
            console.log("in loop");
            wordJson = await getRandomWord(count);
            isAsked = await isAlreadyAnswered(wordJson.word, req.user_id, req.body.course_id);
        } while (isAsked);

        if(!wordJson.is_audio_available){
            console.log('generate audio');
            await main(wordJson.word);
            const filter = { _id: wordJson._id };
            const update = { is_audio_available: true };
            var doc = await db.English.findOneAndUpdate(filter, update);
        }
        let resultRes = await db.Result.find({ user_id: req.user_id, word: wordJson.word, course_id: req.body.course_id});
        if(resultRes.length<1){
            const resultObj = new db.Result({
                word: wordJson.word,
                user_id: req.user_id,
                course_id: req.body.course_id,
            });
            await resultObj.save().then((resultRes1) => {
                return res.status(200).json({word:wordJson.word,result_id:resultRes1._id});
            }).catch((err) => {
                return res.status(500).json({
                    message: "Something went wrong",
                    error: true
                });
            });
        }else{
            res.status(200).json({word:wordJson.word,result_id:resultRes[0]._id});
        }
    },
}

async function totalCount(){
    return new Promise(resolve => {
        db.Dictionary.countDocuments().exec((err, count) => {
            if (err) {
                return res.status(500).json({ error:true, message: "Something went wrong." });
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
                return res.status(500).json({ error:true, message: "Something went wrong." });
            }
            resolve(wordData);
        })
    })
}

async function isAlreadyAnswered(word, userId, courseId){
    return new Promise(resolve => {
        db.Result.find({ user_id: user_id, word: word, course_id: course_id, is_answerd: true}).limit(1).exec((err, result) => {
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
