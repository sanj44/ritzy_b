var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Product = new Schema({
    productId: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    categoryId: {
        type: String,
        trim: true,
        default: null,
        required: true
    },
    productName: {
        type: String,
        trim: true,
        default: null
    },
    clothingType: {
        type: String,
        default: null,
        required: true
    },
    productDesc: {
        type: String,
        default: null,
        required: true
    },
    colorAvailability: {
        type: String,
        trim: true,
        lowercase: true
    },
    sizeAvailability: {
        type: String,
        trim: true,
        select: false,
        required: true
    },    
    dateAvailabilityFrom: {
        type: Date,
        default: null
    },
    dateAvailabilityTo: {
        type: Date,
        default: null
    },
    productDetail: {
        type: String,
        trim: true,
    },
    kerywords: {
        type: String,
        default: null
    },
    image1: {
        type: String,
        default: null
    },
    image2: {
        type: String,
        default: null
    },
    image3: {
        type: String,
        default: null
    },
    image4: {
        type: String,
        default: null
    },
    image5: {
        type: String,
        default: null
    },
    image6: {
        type: String,
        default: null
    },
    stock_available: {
        type: String,
        default: null
    },
    stock_ordered: {
        type: String,
        default: null
    },
    inr: {
        type: Object,
        default: null
    },
    usd: {
        type: Object,
        default: null
    },
    euro: {
        type: Object,
        default: null
    },
    sgd: {
        type: Object,
        default: null
    },
    aud: {
        type: Object,
        default: null
    },

    createdDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: true
    }});

Product.index({
    productId: 1
}, {
    unique: true
});

module.exports = mongoose.model('Product', Product);
