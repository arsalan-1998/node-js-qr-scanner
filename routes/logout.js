
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('login', { 'isLoggedin':false, 'admin':false })
    } else {
        req.session.destroy((err) => {
            res.render('login', { 'isLoggedin':false, 'admin':false })
        })
    }
})

module.exports = router
