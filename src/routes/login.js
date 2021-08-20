const express = require('express')
const router = express.Router()

// index
router.get('/', async (req, res) => {
  res.render('hello')
})


module.exports = router