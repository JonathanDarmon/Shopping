const express = require("express");

const Cart = require("../models/cart");
const Product = require("../models/product");

const router = express.Router();


// get user's cart
router.get("/:user", (req, res, next) => {

    const userId = req.params['user'];
    const cart = Cart;
    cart.findOne({
        "user_id": userId,
        "activeCart": true
    }).then(thisCart => {
        if (!thisCart) {
            return res.status(204).json({
                message: 'No active cart'
            })
        }
        const results_id = [];
        const array = thisCart.cart_content
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            results_id.push(
                id = element.product_id
            );
        }
        const results_quantity = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            results_quantity.push(
                quantity = element.product_quantity
            );
        }
        Product.find({
            "product_id": results_id
        }).then(response => {
            const quantity = results_quantity;
            res.status(200).json({
                cart_details: thisCart,
                products: response.map((data, index) => {
                    return {
                        product_name: data.product_name,
                        product_id: data.product_id,
                        product_price: data.product_price,
                        category_id: data.category_id,
                        product_image: data.product_image,
                        product_quantity: quantity[index]
                    }
                })

            });
        });
    }).catch(err => {

        res.status(500).json({
            message: err
        });
    });

})

// Create a new shopping cart
router.post("/create", (req, res, next) => {
    const data = req.body;
    const cart = new Cart({
        user_id: data.user_id,
        cart_date: data.cart_date,
        activeCart: data.activeCart,
        cart_content: {
            product_id: req.body.cart_data[0].product_id,
            product_quantity: req.body.cart_data[0].product_quantity
        }
    });
    cart.save()
        .then(createdCart => {
            res.status(201).json({
                cart: createdCart
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Creating cart failed!'
            });
        });
});


// updating existing shopping cart
router.post("/:update", (req, res, next) => {
    const cart_id = req.params['update'];

    const prod_id = req.body.product_id;
    Cart.updateOne({
        "_id": cart_id,
        cart_content: {
            "$not": {
                "$elemMatch": {
                    "product_id": prod_id
                }
            }
        }
    }, {
        $addToSet: {
            cart_content: {
                "product_id": prod_id,
                "product_quantity": 1
            }
        }
    }, {
        multi: true
    }).then(response => {
        res.status(201).json({
            message: 'Product added!'
        });
    });
    Cart.update({
        "cart_content.product_id": prod_id
    }, {
        $inc: {
            "cart_content.$.product_quantity": 1
        }
    }, {
        multi: true
    }).then(response => {
        res.status(201).json({
            message: 'Product updated!'
        });

    }).catch(err => {
        status(500).json({
            message: err
        });
    });

});


router.delete('/:delete/:prodId', (req, res, next) => {
    const userId = req.params['delete'];
    const prodId = req.params['prodId'];

    Cart.update({
        "user_id": userId,
        "activeCart": true
    }, {
        "$pull": {
            "cart_content": {
                    "product_id": prodId
            }
        }
    }, {
        multi: true
    }).then(response => {
        
    }).catch(err => {
        res.status(500)
    });
});



module.exports = router;