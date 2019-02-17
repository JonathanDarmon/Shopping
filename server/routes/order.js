const express = require("express");

const Order = require("../models/order");
const Cart = require("../models/cart");

const router = express.Router();

router.post("/create", (req, res, next) => {
    
    const newOrder = req.body;

    const order = new Order({
        user_id: newOrder.user_id,
        cart_id: newOrder.cart_id,
        total_price: newOrder.total_price,
        city: newOrder.city,
        street: newOrder.street,
        shipment_date: newOrder.shipment_date,
        order_date: newOrder.order_date,
        payment: newOrder.payment
    });
    order.save().then(result => {
        
        res.status(201).json({
            message: "Order created!",
            result: {
                order_date: result.order_date,
            }
        });
        Cart.updateOne({"_id": newOrder.cart_id}, {$set: {"activeCart": false}}).then(response => {

        });
        
    }).catch(err => {

        res.status(500).json({
            error: err
        });
    });
});

router.get("", (req, res, next) => {
    
    const order = Order;
    order.find().then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get("/:user_id", (req, res, next) => {
    
    Order.findOne({"user_id": req.params['user_id']}).sort({"order_date": -1})
    .then(response => {
        if (response) {
            res.status(201).json({
                date: response.order_date
            })
        } else {
            return;
        }
        
    }).catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

module.exports = router;