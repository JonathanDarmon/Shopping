const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const productSchema = mongoose.Schema({
    product_name: { type: String, required: false, unique: true},
    product_id: { type: Number, required: false, unique: true },
    product_price: { type: Number, required: false },
    category_id: { type: Number, required: false },
    product_image: { type: String, required: false }
})

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Products", productSchema);