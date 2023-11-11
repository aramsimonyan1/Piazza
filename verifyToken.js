const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token') // Extract the token from the header and check if it is correct.
    if(!token){
        return res.status(401).send({ message:'Access denied' })
    }
    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        
        // 11/11/2023 12:10 below 3 lines replaced:  req.user = verified 
        req.user = {
            _id: verified._id,
            name: verified.username,
          }    

        console.log('User Information:', req.user) // this added 11.11.2023 02:08
        next()
    }catch(err){
        return res.status(401).send({ message:'Invalid token' })
    }
}

module.exports = auth