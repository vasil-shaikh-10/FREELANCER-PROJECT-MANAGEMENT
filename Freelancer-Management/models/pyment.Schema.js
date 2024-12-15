
const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId, ref:'User', required:true
    },
    projectid:{
        type:mongoose.Schema.Types.ObjectId, ref:'Freelancer'
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','completed'],
        default:'pending'
    }
})

const PaymentModel = mongoose.model('Payment',PaymentSchema)

module.exports = PaymentModel