var db = require('../models');
var Promise = require('promise');

module.exports = {
    save_answer: async (req,res) => {
        if (!req.body.course_id || req.body.is_right==null || req.body.is_right==undefined) {
            return res.status(400).json({error:true,message:"Required parameters are missing."});
        }
        const filter = { _id: req.body.course_id};
        if(!req.body.is_right){
            let result = await db.Result.findOne(filter);
            console.log("result "+result);
            let update={};
            if(result!=null){
                update = { wrong_count: result.wrong_count+1 };
                await db.Result.findOneAndUpdate(filter, update);
            }
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
