const joi = require('joi')

// this is a function that accepts data that is given to this function by user, and it will return back the validation applying joi requirements
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation // we are exporting every function separately 
module.exports.loginValidation = loginValidation