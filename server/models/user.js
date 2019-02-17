const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    city: { type: String, required: true},
    street: { type: String, required: true},
    role: { type: String }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);