const mongoose = require('mongoose')
const FreelancerSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type: String, 
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:'User',require:true
    },
    dueDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
      },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
})

const Freelancer = mongoose.model('Freelancer',FreelancerSchema);

module.exports = Freelancer
