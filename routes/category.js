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
    getCategoryById,
    createCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    removeCategory
} = require('../controllers/category')

// Parameter middleware
router.param('userId', getUserById)
router.param('categoryId', getCategoryById)

// routes
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory)
router.get('/category/:categoryId',getCategory)
router.get('/all/category',getAllCategory)
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory)
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory)

module.exports = router