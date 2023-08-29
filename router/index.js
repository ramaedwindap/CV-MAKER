const express = require('express')
const router = express.Router()
const db = require('../db/firestore')

// define the home page route
router.get('/', async (req, res) => {
    try {
        res.status(200).json({ msg: 'Server is running!' })
    } catch (error) {
        res.status(500).json({ msg: 'ISE' })
    }
})

module.exports = router