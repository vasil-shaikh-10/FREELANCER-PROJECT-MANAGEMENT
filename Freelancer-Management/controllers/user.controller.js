const User = require("../models/user.Schema");
const setToken = require("../utils/setToken");

const Register = async(req,res)=>{
    try {
        let {username,email,password,role} = req.body;

        if(!username || !email || !password ){
            return res.stutas(400).json({success:false,message:"All Field Required..."})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email"})
        }

        if(password.length < 6 ){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"})
        }

        let UserExtits = await User.findOne({email:email})
        console.log("UserExtits",UserExtits)
        if(UserExtits){
            return res.status(400).json({success:false,message:"Email already exists"})
        }
        let userObj = new User({
            username,
            email,
            password,
            role
        })
        setToken(userObj._id,res)
        await userObj.save()
        res.status(201).json({success:true,user:{
            ...userObj._doc,
            password:""
        }})
    } catch (error) {
        console.log('Error In Register Controller :- ',error.message)
        res.stutas(500).json({success:false,message:'Internal Server...'})
    }
}

const Login = async(req,res)=>{
    try {
        let {email,password} = req.body;

        if(!email || !password ){
            return res.stutas(400).json({success:false,message:"All Field Required..."})
        }

        let UserExtits = await User.findOne({email:email})
        if(!UserExtits){
            return res.status(400).json({success:false,message:"Email Not Match...."})
        }

        const isPasswordMatch = await UserExtits.compareSchema(password)
        if(isPasswordMatch){
            await setToken(UserExtits._id,res)
            res.status(201).json({success:true,user:{
                ...UserExtits._doc,
                password:""
            }})
        }else{
            res.status(404).send({success:false,message:'Password Not Match.'})
        }
    } catch (error) {
        console.log('Error In Register Controller :- ',error.message)
        res.stutas(500).json({success:false,message:'Internal Server...'})
    }
}

module.exports = {Register,Login}