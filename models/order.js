const mongoose = require('mongoose')
const {
    ObjectId
} = mongoose.Schema

// product cart schema
const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    name: String,
    count: Number,
    price: Number
})

// 'ProductCart' this var below is just used for exporting
const ProductCart = mongoose.model('ProductCart', productCartSchema)

// order schema
const orderScheman = new mongoose.Schema({
    product: [productCartSchema],
    transaction_id: {},
    amount: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

// 'Order' this var below is just used for exporting
const Order = mongoose.model('Order', orderScheman)

module.export = {
    Order,
    ProductCart
}