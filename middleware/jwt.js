const jwt = require('jsonwebtoken');
const secreet = 'HHHSSSssshsh'

function signToken(obj) {
    return jwt.sign(obj, secreet);

}

module.exports = { signToken }