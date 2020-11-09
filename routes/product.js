const express = require('express')
const router = express.Router()

// middlewares
const {
    isAdmin,
    isAuthenticated,
    isSignedIn
} = require('../controllers/auth')
const {
    getUserById
} = require('../controllers/user')
const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    removeProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require('../controllers/product')

// Parameter middleware
router.param('userId', getUserById)
router.param('productId', getProductById)

// My routes

// CRUD 
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', photo)
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct)
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, removeProduct)

// open get routes
router.get('/all/product', getAllProducts)
router.get('/product/categories', getAllUniqueCategories)

module.exports = router