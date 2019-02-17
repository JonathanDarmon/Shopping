const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const shoppingCartSchema = mongoose.Schema({
    user_id: { type: String, required: true},
    cart_date: { type: String, required: true},
    activeCart: { type: Boolean, required: true },
    cart_content: [{
        product_id: { type: String, required: true},
        product_quantity: { type: Number, required: true},
    }]
})

shoppingCartSchema.plugin(uniqueValidator);

module.exports = mongoose.model("shopping_cart", shoppingCartSchema);