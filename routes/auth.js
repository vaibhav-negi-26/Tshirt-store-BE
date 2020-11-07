const express = require('express')
const router = express.Router()
const {
    check
} = require('express-validator')

const {
    signout,
    signup,
    signin,
    isSignedIn
} = require('../controllers/auth')

// expess validator (check for signin parameters)
const signup_check = [
    check('name')
    .isLength({
        min: 3
    }).withMessage('Length of name should be between 5 to 32 chars'),
    check('email').isEmail().withMessage('Valid email should be passed'),
    check('password').isLength({
        min: 6
    }).withMessage('Length of password should be between 6 to 32 chars')
]

const signin_check = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({
        min: 1
    }).withMessage('Password field is required')
]

// signup route
router.post("/signup", signup_check, signup)

// signin route
router.post("/signin", signin_check, signin)

// signout route
router.get("/signout", signout)

module.exports = router