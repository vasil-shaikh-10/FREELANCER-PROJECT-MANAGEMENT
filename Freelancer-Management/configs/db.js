const mongoose = require('mongoose');
require('dotenv').config();
const DatabaseConnect = async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Database Connection...")
}

module.exports = DatabaseConnect