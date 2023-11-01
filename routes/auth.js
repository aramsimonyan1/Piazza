// this file will be for authentication and it will be mapped to the api and to the endpoint
const express = require('express')
const router = express.Router()


const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req, res)=>{

    // Validation1 to check user input based on registerValidation in validation.js
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message: error['details'][0]['message']})
    }

    // Validation2 to check if the user already exists in MongoDB database
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    // salt will add some randomness and complexity to my hashed password
    const salt = await bcryptjs.genSalt(5)
    // Take the password from the body and return a hashed representation of password
    const hashedPassword = await bcryptjs.hash(req.body.password, salt) 

    // Code to insert data
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send({message:err})
    }
    
})

router.post('/login', async(req, res)=>{
    // Validation1 to check user input against loginValidation in validations.js
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message: error['details'][0]['message']})
    }

    // Validation2 to check if the user exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'The email address is not registered in database'})
    }

    // Validation 3 to check if the password is correct
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if(!passwordValidation){
        return res.status(400).send({message:'Incorrect password'})
    }
    
    // Generate an authentication token for a user based on the user id 
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
})
module.exports = router