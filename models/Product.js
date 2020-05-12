const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter a product name'],
        minlength: [5, 'Enter minimum 5 characters for product name'],
        maxlength: [255, 'Enter maximum 225 characters for product name'],
        lowercase: true,
        trim: true
        //uppercase: true
    },
    price: {
        type: Number,
        required: function () {
            return this.isActive;
        },
        min: 0,
        max: 10000,
        get: value => Math.round(value),
        set: value => Math.round(value)
    },
    description:
    {
        type: String,
        minlength: 10
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;
            },
            message: 'Enter at least a tag for this product'
        }
    },
    isActive: Boolean,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }]
});

module.exports = mongoose.model('Product', productSchema);