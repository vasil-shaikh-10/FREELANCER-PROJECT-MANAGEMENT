const joi = require('joi')
const expenseSchema = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    userId:joi.string().required(),
    dueDate:joi.date().required(),
    status:joi.string().required()
})

function validateExpenseData(data){
    return expenseSchema.validate(data);
}

module.exports = validateExpenseData