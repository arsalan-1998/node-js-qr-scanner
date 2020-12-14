
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('login', { 'isLoggedin':false, 'admin':false })
    } else {
        res.render('scan', { 'isLoggedin':true, 'admin':false, 'user_name':req.session.user })
    }
})

module.exports = router
