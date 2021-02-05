
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('login', userSchema)

router.get('/', (req, res) => {
    if( !req.session.user ) {
        res.render('register', { 'isLoggedin':false, 'admin':false })
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

router.post('/', (req, res) => {
    if( !req.body ) {
        res.send('APP_ERROR')
    } else {
        let hashed_password = bcrypt.hashSync(req.body.password, 10)
        mongoose.model('login', userSchema).countDocuments((err, count) => {
            if( count > 0 ) {
                Usr.findOne({ usr_name:req.body.user_name }, (err, doc) => {
                    if(err) res.send('APP_ERROR')
                    else if(!doc) {
                        let newUsr = new Usr({ 
                            "usr_name":req.body.user_name,
                            "usr_email":req.body.user_email,
                            "usr_password":hashed_password,
                            "date": new Date().getDate(),
                            "day": getDay(new Date().getDay()),
                            "month": getMonth(new Date().getMonth()),
                            "year": new Date().getFullYear(),
                            "time": getTime(),
                            "wallet": 5000,
                            "orders": 0,
                            "transaction": 0
                        })

                        newUsr.save().then((value) => {
                            req.session.user = req.body.user_name
                            res.send('SUCCESSFUL')
                        })
                    }
                    else res.send('DATA_ERROR')
                })
            } else {
                let newUsr = new Usr({
                    "usr_name":req.body.user_name,
                    "usr_email":req.body.user_email,
                    "usr_password":hashed_password,
                    "date": new Date().getDate(),
                    "day": getDay(new Date().getDay()),
                    "month": getMonth(new Date().getMonth()),
                    "year": new Date().getFullYear(),
                    "time": getTime(),
                    "wallet": 5000,
                    "orders": 0,
                    "transaction": 0 
                })

                if(!req.body) res.send('APP_ERROR')
                else {
                    newUsr.save().then((value) => {
                        req.session.user = req.body.user_name
                        res.send('SUCCESSFUL')
                    })
                }
            }
        })
    }
})

router.post('/update/user', (req, res) => {
    if( !req.body ) {
        res.send('APP_ERROR')
    } else {
        let hashed_password = bcrypt.hashSync(req.body.password, 10)
        Usr.findOneAndUpdate({ usr_name:req.body.user_name }, { 
            $set:{
                "usr_name":req.body.user_name,
                "usr_password":hashed_password,
                "date": new Date().getDate(),
                "day": getDay(new Date().getDay()),
                "month": getMonth(new Date().getMonth()),
                "year": new Date().getFullYear(),
                "time": getTime(),
                "wallet": 5000,
                "orders": 0,
                "transaction": 0 
            } 
        }, (err, doc) => {
            req.session.user = req.body.user_name
            if(err) res.send('APP_ERROR')
            else res.send('SUCCESSFULL')
        })
    }
})

function getMonth(month) {
    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month];
}

function getDay(day) {
    let days = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];
    return days[day];
}

function getTime() {
    if(new Date().getTime() >= 12) {
        return new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+' PM';
    } else {
        return new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+' AM';
    }
}

module.exports = router
