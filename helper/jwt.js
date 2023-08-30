const jwt = require('jsonwebtoken');
const secreet = process.env.JWT_SECRET

function signToken(obj) {
    return jwt.sign(obj, secreet);
}

function verifyToken(token) {
    return jwt.verify(token, secreet);
}

module.exports = { signToken, verifyToken }