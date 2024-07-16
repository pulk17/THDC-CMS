const ErrorHandler = require('../utils/errorhandler')



const errorhandle = (err,req,res,next) =>{
    err.statusCode = err.statusCode||500;
    err.message = err.message || "Internal Server Error"



    //mongoose duplicate email message
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message , 400)
    }
     
    //jsonwebtoken error 
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid , Try again`
        err = new ErrorHandler(message , 400)
    }

    //jwtExpireerror
    if(err.name === "TokenExpiredError"){
        const message = `Json web token is expired , Try again`
        err = new ErrorHandler(message , 400)
    }

    res.status(err.statusCode).json({
        success:false,
        message :err.message,
    })
}

module.exports = errorhandle;