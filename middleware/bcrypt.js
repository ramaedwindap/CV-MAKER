const bcrypt = require('bcryptjs');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function checkPassword(password, dbPass) {
    return bcrypt.compareSync(password, hash); // true
}

module.exports = { hashPassword, checkPassword }