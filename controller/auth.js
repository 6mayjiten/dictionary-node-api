var db = require('../models');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config'); // get our config file

module.exports = {
    register: (req, res) => {
        if (!req.body.email || !req.body.password || !req.body.first_name) {
            return res.status(400).json({error:true,message:"Required parameters are missing."});
        }else if(req.body.password.length < 8){
            return res.status(400).json({error:true,message:"Password length must be 8."});
        }

        db.User.findOne({ email: req.body.email }, function (err, user) {
            if (err) return res.status(500).json({ error:true, message: "Something went wrong." });
            if (user) return res.status(409).json({ error:true, message: "User already exist." });

            var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            var lastName = req.body.last_name ? req.body.last_name : "";
            db.User.create({ first_name : req.body.first_name, last_name: lastName, email : req.body.email, password : hashedPassword},
                function (err, user) {
                    if (err) return res.status(500).json({error:true,message:"There was a problem registering the user."});
                    var token = jwt.sign({ id: user._id }, process.env.secret, {
                        expiresIn: '720h' // expires in 30 days
                    });
                    user_info = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        id: user._id,
                    }
                    res.status(200).json({ auth: true, token: token, user: user_info });
                });
        });
    },

    login: (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({error:true,message:"Required parameters are missing."});
        }
        db.User.findOne({ email: req.body.email }, function (err, user) {
            if (err) return res.status(500).json({ error:true, message: "Something went wrong." });
            if (!user) return res.status(404).json({ error:true, message: "User doesn't exist." });

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).json({ error:true, message: "Wrong password." });

            var token = jwt.sign({ id: user._id }, process.env.secret, {
                expiresIn: '720h' // expires in 30 days
            });
            user_info = {
                email: user.email,
                id: user._id,
            }
            res.status(200).json({ auth: true, token: token, user: user_info });
        });
    },

    verifyToken: (req, res) => {
        if (!req.body.token){
            return res.status(403).json({ error: true, message: 'No token provided.' });
        }
        console.log(process.env.secret);
        jwt.verify(req.body.token, process.env.secret, function(err, decoded) {
            if (err){
                return res.status(200).json({ auth: false, message: 'Session Expired.' });
            }
            res.status(200).json({ auth: true, message: 'authenticated successfully.' });
        });
    }
}
