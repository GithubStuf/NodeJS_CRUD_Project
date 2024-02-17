const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if(authHeader){
        jwt.verify(token, process.env.SECRET_KEY, (err, user) =>{
            if(err){
                res.status(403).json("Token not valid")
            }
            else{
                req.user = user
            }
        })
    }else{
        return res.status(401).json("You are not auth");
    }
}