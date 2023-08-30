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

router.get('/generate-pdf/:resumeId', Controller.generatePdf)

router.get('/resumes', authentication, Controller.getResume)

router.post('/resumes', authentication, Controller.storeResume)

router.post('/chat-openAi', authentication, Controller.chatOpenAi)

router.use(errorHandler)

module.exports = router