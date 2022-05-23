const path = require('path')
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

// Load Config
dotenv.config({path:'./config/config.env'})

// Passport config
require("./config/passport")(passport)

connectDB()


const app = express()

// Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

// Handlebars helpers
const {formatDate,editIcon,stripTags,truncate,select} = require("./helpers/hbs")

// Handlebars 
app.engine('.hbs',exphbs.engine({
    helpers:{
        formatDate,
        editIcon,
        stripTags,
        truncate,
        select,
    },
    defaultLayout:'main',
    extname:'.hbs'
}));
app.set('view engine','.hbs');

// Sessions
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Set Global Variable
app.use(function(req,res,next){
    res.locals.user = req.user || null // Set to null if it doesn't exist
    next()
})

// Routes
app.use('/' ,require('./routes/index'))
app.use('/auth' ,require('./routes/auth'))
app.use('/stories' ,require('./routes/stories'))

// Static folder
app.use(express.static(path.join(__dirname,"public")))

const port = process.env.PORT || 3001

app.listen(
    port,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
)