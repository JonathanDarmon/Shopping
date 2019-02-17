const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema({
    id: { type: String, required: false, unique: true},
    categoryName: { type: Number, required: false, unique: true },
})

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);