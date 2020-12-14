
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if( !req.session.user ) res.render('login', { 'isLoggedin':false, 'admin':false })
    else res.render('index', { 'isLoggedin':true, 'admin':false })
})

module.exports = router