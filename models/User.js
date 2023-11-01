const mongoose = require('mongoose') // variable mongoose requires the mongoose package

//creating a user schema that is mongoose schema
const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024 // because we will use # function to hash our password
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('users', userSchema)