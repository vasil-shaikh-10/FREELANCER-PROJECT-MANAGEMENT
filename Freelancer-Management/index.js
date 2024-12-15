const express = require('express');
const cookie = require('cookie-parser')
const DatabaseConnect = require('./configs/db');
const userRouter = require('./routers/user.router');
const FRouter = require('./routers/freelancer.router');
require('dotenv').config()
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())

app.use('/Auth',userRouter)
app.use('/Freelancer',FRouter)
app.listen(process.env.PORT,()=>{
    console.log("Server Start...");
    DatabaseConnect()
})