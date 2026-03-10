const Joi = require('joi')

const transaction_validators= Joi.object({
    payment_type: Joi.string().valid('PhonePe', 'Razorpay').required()
})

module.exports = {
    transaction_validators
}