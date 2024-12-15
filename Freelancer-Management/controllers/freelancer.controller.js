const csv = require('fast-csv');
const { Parser } = require('json2csv');
const fs = require('fs');
const Rezorpay=require("razorpay")  
const validateExpenseData = require('../utils/validatore');
const Freelancer = require('../models/freelancer.Schema');
const PaymentModel = require('../models/pyment.Schema');
require('dotenv').config()


const razorpay=new Rezorpay({
    key_id:process.env.RZP_KEY,
    key_secret:process.env.RZP_SECRET
}) 

const AllProjectShow = async (req, res) => {
    try {
        let Data = await Freelancer.find()
        res.status(200).json({ Data })
    } catch (error) {
        console.log('Error In AllProjectShow Controller :- ', error.message)
        res.stutas(500).json({ success: false, message: 'Internal Server...' })
    }
}

const ProjectCreaet = async (req, res) => {
    try {
        const fileRows = [];
        const error = [];
        csv.parseFile(req.file.path, { headers: true })
            .on('data', (row) => {
                const { error } = validateExpenseData(row);
                if (error) {
                    error.push({ row, error: error.message });
                } else {
                    fileRows.push(row)
                }
            })
            .on('end', async () => {
                try {
                    const expenses = fileRows.map((row) => ({
                        title: row.title,
                        description: row.description,
                        userId: row.userId,
                    }))
                    await Freelancer.insertMany(expenses);
                    res.status(201).json({ message: "Expense UploadedSuccessfully.", error });
                } catch (err) {
                    res.status(500).json({ message: "Databse Error", error: err.message })
                }
            })
    } catch (error) {
        console.log('Error In ProjectCreae Controller :- ', error.message)
        res.stutas(500).json({ success: false, message: 'Internal Server...' })
    }
}


const ProjectUpdate = async(req, res) => {
    try {
        let {id} = req.params;
        let update = req.body;
        const allFiled = ['title','description','userId','dueDate','status']   
        const isOperation = Object.keys(update).every((key) => allFiled.includes(key)) 

        const Data = await Freelancer.findByIdAndUpdate(id,update,{new:true,runValidators:true});

        if(!Data){
            return res.status(404).json({message:'Project not Found.'})
        }
        res.status(200).json({message:'Project Update Successfully.',Data})
        if(!isOperation){
            return res.status(400).json({message:'Invalid Fields in updates.'})
        }
    } catch (error) {
        console.log("Error In ProjectUpdate Controller :- ",error.message)
        res.status(400).json({message:'Internal Error :- ',error:error})
    }
}

const ProjectDelete = async(req,res)=>{
    try {
        let {FreelancerId} = req.body
        if(!Array.isArray(FreelancerId) || FreelancerId.length === 0){
            res.status(400).json({message:'ids must be a non-empty array.'})
        }
        const DeleteData = await Freelancer.deleteMany({_id:{$in:FreelancerId}})
        res.status(201).json({message:`${DeleteData.deletedCount} expenses delete successfully.`,deletedCount:DeleteData})
    } catch (error) {
        console.log("Error In ProjectDelete Controller :- ",error.message)
        res.status(400).json({message:'Internal Error :- ',error:error})
    }
}

const ProjectExport = async(req,res)=>{
    try {
        const fields = ['title', 'description', 'userId','dueDate','status'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
        res.status(200).send(csv);
    } catch (error) {
        console.log("Error In ProjectExport Controller :- ",error.message)
        res.status(400).json({message:'Internal Error :- ',error:error})
    }
}

const Payment =async(req,res)=>{
    let {userid,projectid,amount} = req.body;
    console.log(process.env.RZP_KEY)
    try {
        let option={
            amount:amount*100,
        }
        razorpay.orders.create(option,async(err,order)=>{
            console.log("Errrr",order)

            if(err){
                res.send(err)
            }
            if(order){
                let data={
                  success:true,
                  msg:"order create",
                  order_id:order.id,
                  key_id:process.env.RZP_KEY,
                  name:"jeel",
                  amount:option.amount
                }
                await PaymentModel.create({
                    userid,amount,status:"completed"
                })
               return res.status(200).json({success:true,message:'Payment SuccessFully Done...',PatmentData : data})
              }
        })
        // res.status(200).json({success:true,message:'Payment SuccessFully Done...'})

    } catch (error) {
        console.log("Error In Payment Controller :- ",error.message)
        res.status(400).json({message:'Internal Error :- ',error:error})
    }
}

module.exports = { ProjectCreaet, AllProjectShow, ProjectUpdate, ProjectDelete, ProjectExport, Payment }