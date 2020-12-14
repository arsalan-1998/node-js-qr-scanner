
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('reset', { 'isLoggedin':false, 'admin':false })
    } else {
        Usr.findOne({ usr_name:req.session.user }, (err, doc) => {
            if(!doc) {
                res.render('error', { 'isLoggedin':true, 'admin':false, 'data':'DATA_ERROR' })
            } else {
                if( doc.role == true ) {
                    Usr.find((err, doc) => {
                        res.render('dashboard', { 'isLoggedin':true, 'admin':true, "user_name":req.session.user, 'users':doc })
                    })
                } else {
                    let data = {
                        "wallet": 123,
                        "user_email": "anonymousCoder047@gmail.com",
                        "orders": 12,
                        "transaction": 1235
                    }
                    data.wallet = doc.wallet ? doc.wallet : 0
                    data.user_email = doc.usr_email
                    data.orders = doc.orders ? doc.orders : 0
                    data.transaction = doc.transaction ? doc.transaction : 0
                    res.render('dashboard', { 'isLoggedin':true, 'admin':false, "user_name":req.session.user, 'data':data })
                }
            }
        })
    }
})

module.exports = router
