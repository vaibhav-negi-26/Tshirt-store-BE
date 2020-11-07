const User = require('../models/user')
const {Order} = require('../models/order')

// middle ware binds profile property with req
exports.getUserById = (req, res, next, id) => {

    User.findById(id).exec((err, found_user) => {

        if (err || !found_user) {
            return res.status(400).send({
                error: 'No user was found in DB'
            })
        }


        req.profile = found_user
        next()

    })
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.send(req.profile)
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        }, {
            new: true,
            useFindAndModify: false
        },
        (err, user) => {
            if (err) {
                return res.status(400).send({
                    error: 'Not authorized to update this user.'
                })
            }

            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined

            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res) => {
    
    Order.find({user : req.profile._id})
    .populate('user' , '_id name')
    .exec((err,orders) => {

        if(err || !orders){
            return res.status(400).json({
                error : 'No order found'
            })
        }

        return res.json(orders)
    })

}

// middle ware to update purchases in user
exports.pushOrderInPurchaseList = (req,res,next) => {

    let purchases = []
    req.body.orders.products.forEach( product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantitiy : product.quantitiy,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    })

    // storing in DB
    User.findByIdAndUpdate(
        { _id : req.profile._id},
        { $push : {purchases : purchases} },
        { new : true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error : 'Unable to save purchase list'
                })
            }
            next()
        }
    )

}