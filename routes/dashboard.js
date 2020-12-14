
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const userSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('login', userSchema)

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('login', { 'isLoggedin':false, 'admin':false })
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
                        "transaction": 1235,
                        "limit": 756,
                        "total_amount":1555,
                        "status": "debit",
                        "trans_status": ""
                    }
                    data.wallet = doc.wallet ? doc.wallet : 0
                    data.user_email = doc.usr_email
                    data.orders = doc.orders ? doc.orders : 0
                    data.transaction = doc.transaction ? doc.transaction : 0
                    data.limit = doc.wallet_limit ? doc.wallet_limit : 0
                    data.total_amount = doc.total_balance ? doc.total_balance : 0
                    data.status = doc.status ? doc.status : "debit"
                    data.trans_status = doc.trans_status ? doc.trans_status : ""
                    res.render('dashboard', { 'isLoggedin':true, 'admin':false, "user_name":req.session.user, 'data':data })
                }
            }
        })
    }
})

router.get('/wallet/limit', (req, res) => {
    Usr.findOne({ usr_name:req.session.user }, (err, doc) => {
        if(err) res.send('APP_ERROR')
        else res.send(doc.wallet_limit)
    })
})

router.post('/wallet/limit', (req, res) => {
    let date = 30
    let total_days = daysInMonth(new Date().getMonth(), new Date().getFullYear())
    if(req.data === '') res.send('DATA_ERROR')
    else {
        if( req.body.debit != 0 && ( date != total_days ) ) {
            Usr.findOne({ usr_name:req.session.user }, (err, doc) => {
                let wallet = doc.wallet - req.body.debit
                let limit = doc.wallet_limit - req.body.debit
                Usr.findOneAndUpdate({ usr_name:req.session.user }, {
                    $set: {
                        "wallet":wallet,
                        "wallet_limit":limit,
                        "transaction":req.body.debit,
                        "orders":req.body.debit,
                        "status": "debit",
                        "trans_status": "success"
                    }
                }, (err, doc) => {
                    if(err) res.send('APP_ERROR')
                    else res.send('SUCCESSFULL')
                })
            })
        } else if( req.body.debit > 0 && ( date == total_days ) ) {
            Usr.findOne({ usr_name:req.session.user }, (err, doc) => {
                let wallet_limit = parseInt(doc.total_balance) / 13
                Usr.findOneAndUpdate({ usr_name:req.session.user }, {
                    $set: {
                        "wallet_limit":wallet_limit+parseInt(doc.wallet_limit)
                    }
                }, (err, doc) => {
                    if(err) res.send('APP_ERROR')
                    else res.send('SUCCESSFULL')
                })
            })
        }
    }
})

// router.post('/wallet', (req, res) => {
//     if(req.data === '') res.send('DATA_ERROR')
//     else {
//         Usr.findOneAndUpdate({ usr_name:req.body.user_name }, {
//             $set: {
//                 "wallet":req.body.wallet_points,
//                 "status": "credit",
//                 "trans_status": ""
//             }
//         }, (err, doc) => {
//             if(err) res.send('APP_ERROR')
//             else res.send('SUCCESSFULL')
//         })
//     }
// })

router.post('/limit', (req, res) => {
    if(req.data === '') res.send('DATA_ERROR')
    else {
        Usr.findOne({ usr_email:req.body.user_email }, (err, doc) => {
            if(!doc.wallet_limit) {
                let wallet = parseInt(req.body.wallet_limit * 12) + parseInt(req.body.wallet_limit)
                Usr.findOneAndUpdate({ usr_email:req.body.user_email }, {
                    $set: {
                        "wallet": wallet,
                        "total_balance": wallet,
                        "wallet_limit": req.body.wallet_limit,
                        "status": "credit",
                        "trans_status": ""
                    }
                }, (err, doc) => {
                    if(err) res.send('APP_ERROR')
                    else res.send('SUCCESSFULL')
                })
            } else {
                let wallet = parseInt(req.body.wallet_limit * 12) + parseInt(req.body.wallet_limit)
                Usr.findOneAndUpdate({ usr_email:req.body.user_email }, {
                    $set: {
                        "wallet": wallet,
                        "total_balance": wallet,
                        "wallet_limit":doc.wallet_limit+req.body.wallet_limit,
                        "status": "credit",
                        "trans_status": ""
                    }
                }, (err, doc) => {
                    if(err) res.send('APP_ERROR')
                    else res.send('SUCCESSFULL')
                })
            }
        })
    }
})

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = router
