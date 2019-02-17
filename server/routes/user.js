const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

// User Register
router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                id: req.body.id,
                email: req.body.email,
                name: req.body.name,
                lastName: req.body.lastName,
                city: req.body.city,
                street: req.body.street,
                role: 'user',
                password: hash
            });
            user.save()
                .then(result => {
                    if (!result) {
                        return res.status(401).json({
                            message: 'This email already exists!'
                        })
                    }
                    res.status(201).json({
                        message: 'User created!'
                    });
                })
                .catch(err => {
                    res.status(500).json({
                            message: 'Invalid authentication credentials!'
                    });
                });
        });

});

// User Login
router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email,  })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "No such a user"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => { 
            if(!result) {
                return res.status(401).json({
                    message: "Wrong password"
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id}, 
                'secret_this_should_be_longer',
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 7200,
                data: fetchedUser
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Already logged in"
            });
        });
});

module.exports = router;