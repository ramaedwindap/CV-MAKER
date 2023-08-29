function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validMinLength(input, minLength) {
    return input.length < minLength;
}

module.exports = { isValidEmail, validMinLength }