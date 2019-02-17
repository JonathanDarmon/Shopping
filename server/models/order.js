const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = mongoose.Schema({
    user_id: { type: String, required: true},
    cart_id: { type: String, required: true},
    total_price: { type: Number, required: true},
    city: { type: String, required: true},
    street: { type: String, required: true},
    shipment_date: { type: String, required: true},
    order_date: { type: String, required: true},
    payment: { type: Number, required: true},
})

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model("order", orderSchema);