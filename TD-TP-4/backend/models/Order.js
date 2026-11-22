const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
 customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 items: [{ productId: String, name: String, imageUrl: String, price: Number, quantity: Number }],
 total: { type: Number, required: true },
 status: { type: String, enum: ['placed','shipped'], default: 'placed' },
}, { timestamps: true })
module.exports = mongoose.model('Order', orderSchema)
