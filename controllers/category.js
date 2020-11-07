const Category = require('../models/category')

// Middle ware to get category from DB
exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, category) => {

        if (err || !category) {
            return res.status(400).json({
                error: 'Category not found in DB'
            })
        }

        req.category = category
        next()
    })

}

// Route for creating category
exports.createCategory = (req, res) => {

    const category = new Category(req.body)
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'Category not found in DB'
            })
        }
        res.json({category})
    })

}

// Route for getting category
exports.getCategory = (req,res) => {
    return res.json(req.category)
}

exports.getAllCategory = (req,res) => {

    Category.find({}).exec((err,categories) => {
        if (err || categories.length == 0) {
            return res.status(400).json({
                error: 'Category collection is empty.'
            })
        }
        return res.json(categories)
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err,updateCategory) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to update category'
            })
        }
        res.json(updateCategory)
    })
}

exports.removeCategory = (req,res) => {
    const category = req.category
    category.remove((err,removedCategory) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to remove category'
            })
        }
        res.json({
            msg : `${removedCategory.name} has been removed`
        })
    })
}