const express = require('express');
const router = express.Router();

const Category = require('../models/Category.js');

router.post('/', async (req, res) => {
    const newCat = new Category(req.body);
    try {
        const savedCategory = await newCat.save();
        res.status(200).json(savedCategory);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;