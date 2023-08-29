const { verifyToken } = require("../helper/jwt")

async function authentication(req, res, next) {
    try {
        const { access_token } = req.headers

        if (!access_token) throw { name: "invalidToken" }

        const validToken = verifyToken(access_token)

        if (!validToken) throw { name: "invalidToken" }

        req.user = validToken
        // console.log(validToken, 'checktoken =============')
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication