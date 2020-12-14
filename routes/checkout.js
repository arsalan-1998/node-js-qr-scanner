
const express = require('express')
const mongoose = require('mongoose')
const userSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('login', userSchema)
const router = express.Router()

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('login', { 'isLoggedin':false, 'admin':false })
    } else {
        let date = new Date().getDate()
        let total_days = daysInMonth(new Date().getMonth(), new Date().getFullYear())
        Usr.findOne({ usr_name:req.session.user }, (err, doc) => {
            if( ( doc.wallet_limit == 0 ) && ( date != total_days ) ) {
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
                                "transaction": 1235,
                                "limit": 756,
                                "status": "debit",
                                "trans_status": "failed"
                            }
                            data.wallet = doc.wallet ? doc.wallet : 0
                            data.user_email = doc.usr_email
                            data.orders = doc.orders ? doc.orders : 0
                            data.transaction = doc.transaction ? doc.transaction : 0
                            data.limit = doc.wallet_limit ? doc.wallet_limit : 0
                            data.status = doc.status ? doc.status : "debit"
                            res.render('dashboard', { 'isLoggedin':true, 'admin':false, "user_name":req.session.user, 'data':data })
                        }
                    }
                })
            } else {
                res.render('checkout', { 'isLoggedin':true, 'admin':false, "user_name":req.session.user })
            }
        })
    }
})

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = router
