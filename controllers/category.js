const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'category not found'
            });
        }

        req.category = category;
        next();
    })
}

exports.create = (req, res) => {
    const category = new Category(req.body);
    // console.log(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({ data });
    });
}

exports.read = (req, res) => {
    let category = req.category;
    return res.json(category);
}

exports.update = (req, res) => {
    let category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json(data);
    });
}

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: `category sucessfully removed`
        });
    });
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json(data);
    })
}
