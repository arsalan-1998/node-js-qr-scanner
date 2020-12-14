
const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    usr_name: String,
    usr_email: String,
    usr_password: String,
    date: String,
    day: String,
    month: String,
    year: String,
    time: String,
    wallet: String,
    wallet_limit: String,
    total_balance: String,
    orders: String,
    transaction: String,
    status: String,
    trans_status: String,
    role: {
        type: Boolean,
        default: false
    }
});

