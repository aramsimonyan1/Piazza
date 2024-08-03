// command to run the server: npm start
// command to manually stop the process: ctrl + c 
const express = require('express')   // importing an express library
const app = express()                // creating new app that is an express app

const mongoose = require('mongoose') // creating mongoose variable for a mongoose library 
const bodyParser = require('body-parser') // this will help me to pars my data as json
require('dotenv/config')             // will help us to store a MongoDB database collection link 

app.use(bodyParser.json())

const postsRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/post', postsRoute)
app.use('/api/user', authRoute)

mongoose.connect(process.env.DB_CONNECTOR).then(() => { // connecting to .env file
    console.log('DB is connected')
})

app.listen(3000, () => {
    console.log('server is running')
})