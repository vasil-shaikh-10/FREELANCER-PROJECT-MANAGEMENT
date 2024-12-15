const jwt = require('jsonwebtoken')
require('dotenv').config()
const setToken = async(userid,res)=>{
    try {
        let token = jwt.sign({userid},process.env.JWT_SECRET,{expiresIn:'15d'})
        res.status(201).cookie("jwt-Freelancer",token,{
            maxAge:15 * 24 * 60 * 60 * 1000, // 15 days in MS
            httpOnly:true,
            sameSite:"strict"
        })
        return token;
    } catch (error) {
        console.log('Error In setToen Utils :- ',error.message);
        res.status(500).json({message:'Internal Error :- ',error:error})
    }
}

module.exports = setToken