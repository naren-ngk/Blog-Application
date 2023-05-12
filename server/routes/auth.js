const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User.js');

// Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });
        const user = await newUser.save();
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;