const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token') // Extract the token from the header and check if it is correct.
    if(!token){
        return res.status(401).send({message:'Access denied'})
    }
    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(err){
        return res.status(401).send({message:'Invalid token'})
    }
}

module.exports = auth