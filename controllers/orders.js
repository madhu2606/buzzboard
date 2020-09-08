const express = require("express");
const order = require('../modals/ordersModal');
const mongoose = require('mongoose');
const _lodash = require('lodash');
const exceptionHandler = require('../middleware/exceptionHandler');
const router = express.Router();

// Exceptions are handled by a custom middleware called "exceptionHandler"

router.post('/create', exceptionHandler((req, res) => {
    const filter = { order_id: req.body.order_id };
    order.find(filter)
        .exec()
        .then(async (result) => {
            if (result.length === 0) {
                const newOrder = new order(_lodash.pick(req.body, ['order_id', 'item_name', 'cost', 'order_date', 'delivery_date']));
                const newResult = await newOrder.save();
                res.status(200).send(_lodash.pick(newResult, ['order_id', 'item_name', 'order_date', 'delivery_date']));
            }
            else {
                res.status(200).send(`Duplicate Order ID: ${req.body.order_id}`);
            }
        });
}));

router.put('/update', exceptionHandler(async (req, res) => {
    const filter = { order_id: req.body.order_id };
    const update = { delivery_date: req.body.delivery_date };
    const result = await order.findOneAndUpdate(filter, update, { new: true });
    res.status(200).send(_lodash.pick(result, ['order_id', 'item_name', 'order_date', 'delivery_date']));
}));

router.post('/list', exceptionHandler(async (req, res) => {
    const result = await order.find({ order_date: req.body.order_date });
    res.status(200).json({ result });
}));

router.post('/search', exceptionHandler(async (req, res) => {
    const result = await order.find({ order_id: req.body.order_id });
    res.status(200).json({ result });
}));

router.delete('/delete', exceptionHandler(async (req, res) => {
    const result = await order.findOneAndRemove({ order_id: req.body.order_id });
    res.status(200).json({ result });
}));

module.exports = router;