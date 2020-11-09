const express = require('express')
const router = express.Router()

// middlewares
const {
    isAdmin,
    isAuthenticated,
    isSignedIn
} = require('../controllers/auth')
const {
    getUserById,
    pushOrderInPurchaseList
} = require('../controllers/user')
const {
    updateStocks
} = require('../controllers/product')
const {
    getOrderById,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateStatus
} = require('../controllers/order')

// Parameter middleware
router.param('userId', getUserById)
router.param('orderId', getOrderById)

// My Routes

// creation of order
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStocks, createOrder)
// get all orders in DB
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)
// get all possible values of order status
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
// update order status
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router