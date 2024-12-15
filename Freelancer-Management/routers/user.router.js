const {Router} = require('express')
const {Register,Login} = require('../controllers/user.controller')

const userRouter = Router()

userRouter.post('/register',Register)
userRouter.post('/login',Login)
module.exports = userRouter