const User = require('../models/user')
const {
    validationResult, check
} = require('express-validator');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = (req, res) => {

    // validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            errors: errors.array()[0].msg,
            param: errors.array()[0].param
        });
    }

    // saving user
    const user = new User(req.body)
    user.save((err, saved_user) => {
        if (err) {
            return res.status(400).send({
                error: "Redundant or Invalid data passed!"
            })
        } else {
            return res.send({
                name: saved_user.name,
                email: saved_user.email,
                id: saved_user._id
            })
        }
    })
}

exports.signin = (req, res) => {

    const {
        email,
        password
    } = req.body

    // validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            errors: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }

    User.findOne({
        email
    }, (err, found_user) => {

        if (err || !found_user) {
            // console.log(!!err);
            // console.log(found_user);
            return res.status(400).json({
                error: "User email does not exist"
            })
        }

        if (!found_user.authentication(password)) {
            return res.status(401).send({
                error: "Email and password does not match"
            })
        }

        //      Generating token 
        const token = jwt.sign({
            _id: found_user._id
        }, process.env.SECRET)

        //      Setting cookie
        res.cookie('token', token, {
            expire: new Date() + 9999
        })

        // send response to frontend
        const {
            _id,
            name,
            email,
            role
        } = found_user

        return res.send({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        })

    })

}

exports.signout = (req, res) => {
    res.clearCookie('token')
    res.send({
        msg: "User signout successfully"
    })
}

// middleware from express-jwt (isSignedIn)
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty: 'auth'
})

// custom middle ware (isAuthenticated)
exports.isAuthenticated = (req,res,next) => {
     
    //              FE sets this |  middleware sets this |
    const checker = req.profile && req.auth && req.profile._id == req.auth._id

    if(!checker){
        return res.status(403).send({
            error : 'Access denied'
        })
    }
    next()
}

// custom middle ware (isAdmin)
exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).send({
            error : 'Access denied'
        })
    }
    next()
}