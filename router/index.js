const express = require('express')
const router = express.Router()
const errorHandler = require('../middleware/errorHandler')
const Controller = require('../controller/Controller')
const authentication = require('../middleware/authentication')

// define the home page route
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ msg: 'Server is running!' })
    } catch (error) {
        res.status(500).json({ msg: 'ISE' })
    }
})

router.post('/register', Controller.register)

router.post('/login', Controller.login)

// router.get('/resumes', Controller.getResume)

// router.put('/resumes', Controller.updateResume)

router.post('/resumes', authentication, Controller.storeResume)

router.use(errorHandler)

module.exports = router