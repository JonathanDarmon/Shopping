const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const shoppingRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

mongoose.connect("mongodb://localhost:27017/shopping", {useNewUrlParser: true})
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join('uploads')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
})

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopping-cart', shoppingRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;