const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

// Middleware for product by id
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).send({
                    product
                })
            }
            req.product = product
            next()
        })
}

// Controller
exports.createProduct = (req, res) => {

    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Problem with the file"
            })
        }

        // Validation of fields
        const {
            name,
            description,
            price,
            category,
            stock
        } = fields
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        // Creating product
        const product = new Product(fields)

        // Handling file
        if (file.photo) {
            if (file.photo.size > (3 * 1024 * 1024)) {
                return res.status(400).json({
                    error: "File too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // saving product to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Saving into DB failed"
                })
            }
            res.json({
                product
            })
        })

    })

}

// Controller
exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

// Middleware for photo
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

// Controller
exports.removeProduct = (req, res) => {
    const product = req.product
    product.remove((err, removedProduct) => {
        if (err) {
            return res.status(400).send({
                error: 'Failed to delete product'
            })
        }
        res.json({
            msg: 'Deletion was a success'
        })
    })
}

// Controller
exports.updateProduct = (req, res) => {
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                error: "Problem with the file"
            })
        }

        // Getting current product
        const product = req.product
        product = _.extend(product, fields)

        // Handling file
        if (file.photo) {
            if (file.photo.size > (3 * 1024 * 1024)) {
                return res.status(400).json({
                    error: "File too big"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // saving product to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Updation of product failed"
                })
            }
            res.json({
                product
            })
        })

    })
}

// Controller
exports.getAllProducts = (req, res) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : 8
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id'

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([
            [sortBy, 'asc']
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err || !products) {
                return res.status(400).send({
                    error: "No Product Found"
                })
            }

            res.send({
                products
            })
        })

}

// Controller
exports.getAllUniqueCategories = (req, res) => {

    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).send({
                error: 'No categories found'
            })
        }

        res.send(categories)
    })

}

// Middleware Bulkwrite () Updating inventory
exports.updateStocks = (req, res, next) => {

    const myOptions = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {
                    _id: prod._id
                },
                update: {
                    $inc: {
                        stock: -prod.count,
                        sold: +prod.count
                    }
                }
            }
        }
    })


    Product.bulkWrite(myOptions,{},(err,products) => {
        if(err){
            return res.status(400).send({
                error: 'Updation of inventory failed'
            })
        }
        next()
    })
}