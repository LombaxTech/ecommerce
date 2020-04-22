const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, { timestamps: true })


const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;