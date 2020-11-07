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
    getUser,
    updateUser
} = require('../controllers/user')

// params (works before every route where the mentioned param is present)
router.param('userId' , getUserById)

// routes
router.get("/user/:userId", isSignedIn,isAuthenticated ,getUser)
router.put("/user/:userId", isSignedIn,isAuthenticated ,updateUser)

module.exports = router