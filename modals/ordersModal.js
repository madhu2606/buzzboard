const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    order_id: String,
    item_name: String,
    cost: Number,
    order_date: String,
    delivery_date: String,
    created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);