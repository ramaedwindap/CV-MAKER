const express = require('express')
const router = express.Router()
const errorHandler = require('../middleware/errorHandler')
const Controller = require('../controller/Controller')

// define the home page route
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ msg: 'Server is running!' })
    } catch (error) {
        res.status(500).json({ msg: 'ISE' })
    }
})

router.post('/register', Controller.register)

router.use(errorHandler)

module.exports = router