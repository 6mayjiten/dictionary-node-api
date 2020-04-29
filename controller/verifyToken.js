var jwt = require('jsonwebtoken');
var config = require('../config');

verifyToken = (req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).json({ error: true, message: 'No token provided.' });

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).json({ error: true, message: 'Failed to authenticate token.' });
        // if everything is good, save to request for use in other routes
        req.user_id = decoded.id;
        next();
    });
}

module.exports = verifyToken;
