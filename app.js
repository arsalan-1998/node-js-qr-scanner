
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const Home = require('./home/home')
const Login = require('./routes/login')
const Register = require('./routes/register')
const Reset = require('./routes/reset')
const Otp = require('./routes/otp')
const Dashboard = require('./routes/dashboard')

app.set('view engine', 'ejs')
app.use(session({
    secret:'shhhh',
    cookie: {
        secure: false,
        maxAge: 1000*60*60
    },
    saveUninitialized: false,
    resave: false,
    unset: false
}))
app.use('/public', express.static(path.join(__dirname + '/public')))
app.use(bodyParser.urlencoded({ extended:false }))

app.use('/', Home)
app.use('/login', Login)
app.use('/register', Register)
app.use('/reset', Reset)
app.use('/reset/otp', Otp)
app.use('/dashboard', Dashboard)

const port = process.env.PORT || 3000
const host = '127.0.0.1'

app.listen(port, () => console.log(`Listening on http:${host}:${port}`))