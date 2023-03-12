const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    isDeleted:{type:Boolean,default:false}
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);