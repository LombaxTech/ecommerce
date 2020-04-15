const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productId = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'imaged could not be uploaded'
            })
        }

        let product = new Product(fields);

        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'all fields are required'
            });
        }

        if (files.photo) {
            // console.log(files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'size of file should be less than 1mb'
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            return res.json(result);
        });

    });
}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            deletedProduct,
            msg: 'product has been deleted'
        })
    });
}

exports.update = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'imaged could not be uploaded'
            })
        }

        let product = req.product;
        product = _.extend(product, fields);

        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'all fields are required'
            });
        }

        if (files.photo) {
            // console.log(files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'size of file should be less than 1mb'
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            return res.json(result);
        });

    });
}

exports.list = (req, res) => {

    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err || !data) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            return res.send(data)
        })
}

// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=arrival
// if no params, then send all products 
// these queries come fromt the front end client 
