
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const Home = require('./home/home')
const Login = require('./routes/login')
const Register = require('./routes/register')
const Reset = require('./routes/reset')
const Otp = require('./routes/otp')
const Dashboard = require('./routes/dashboard')
const Logout = require('./routes/logout')
const Scan = require('./routes/scan')
const Checkout = require('./routes/checkout')

app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/scanner', 
{
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false 
}).then(() => { console.log('connected to MongoDB') })

app.use(session({
    secret: 'shhhhhhhhhhhh',
    name: 'sid',
    resave: false,
    saveUninitialized: true, 
    store: new MongoStore({ mongooseConnection: mongoose.connection, collection: 'session' }) 
}))
app.use('/public', express.static(path.join(__dirname + '/public')))
app.use(bodyParser.urlencoded({ extended:false }))

app.use('/', Home)
app.use('/login', Login)
app.use('/register', Register)
app.use('/reset', Reset)
app.use('/reset/otp', Otp)
app.use('/dashboard', Dashboard)
app.use('/logout', Logout)
app.use('/scan', Scan)
app.use('/checkout', Checkout)

const port = process.env.PORT || 3000
const host = '127.0.0.1'

app.listen(port, () => console.log(`Listening on http:${host}:${port}`))