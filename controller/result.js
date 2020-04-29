var db = require('../models');
var Promise = require('promise');

module.exports = {
    save_answer: async (req, res) => {
        if (!req.body.result_id || req.body.is_right == undefined) {
            return res.status(400).json({error:true,message:"Required parameters are missing. (result_id, is_right)"});
        }
        const filter = { _id: req.body.result_id};
        if(!req.body.is_right){
            await db.Result.findOne(filter).then( (result) => {
                if(result){
                    let update={};
                    update = { wrong_count: result.wrong_count+1 };
                    db.Result.findOneAndUpdate(filter, update,{new: true},(err, updatedResult) => {
                        console.log(updatedResult);
                    });
                }
            }).catch((err) => {
                return res.status(500).json({
                    message: "Something went wrong",
                    error: true
                });
            });
        }else{
            await db.Result.findOneAndUpdate(filter, {is_answerd: true});
        }
        res.status(200).json({success:true});
    },
    get_result: async (req,res) => {
        if(!req.body.course_id && !req.body.user_id){
            return res.status(400).json({error: true, message:'Missing required parameter.'});
        }

    }
}
