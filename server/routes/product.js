const express = require("express");
const multer = require('multer');

const Product = require("../models/product");
const Category = require("../models/category");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, './uploads');
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("/create", multer({
    storage: storage
}).single('product_image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const product = new Product({
        product_name: req.body.product_name,
        product_id: req.body.product_id,
        product_price: req.body.product_price,
        category_id: req.body.category_id,
        product_image: url + "/uploads/" + req.file.filename
    });
    product.save()
        .then(createdProduct => {
            res.status(201).json({
                message: 'Product created!',
                product: {
                    ...createdProduct
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get("", (req, res, next) => {
    const product = Product;
    product.find().then(data => {
            res.status(200).json({
                count: data.length,
                products: data.map(data => {
                    return {
                        product_name: data.product_name,
                        product_id: data.product_id,
                        product_price: data.product_price,
                        category_id: data.category_id,
                        product_image: data.product_image
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });

    router.get('/:category', (req, res, next) => {
            Product.find({category_id: req.params['category']}).then(data => {
            res.status(200).json({
                products: data.map(data => {
                    return {
                        product_name: data.product_name,
                        product_id: data.product_id,
                        product_price: data.product_price,
                        category_id: data.category_id,
                        product_image: data.product_image
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
    

module.exports = router;