// Import mongoose 
const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        artist: {
            type: String
        },
        description: {
            type: String
        },
        artType: {
            type: String
        },
        genre: {
            type: String
        },
        availability: {
            type: Boolean
        },
        likes: {
            type: Array
        },
        image: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

const ProductsModel = mongoose.model('products', ProductsSchema);
module.exports = ProductsModel;

// title = title of the art item
// artist = id of the artist
// description = a description of the artwork
// artType = type of artwork (e.g. sculpture, events, paintings, etc.) - linked to interests in Usermodel
// genre = genre of the artwork (e.g. portrait, landscape, still life, etc.)
// availability = boolean on whether the artwork has been sold, or if quantity is more than one whether art has sold out 
// likes = array of users who like the artwork
// image = an image file for the artwork
// price = the price of the artwork
// quantity = how many items of artwork are available
// date = date the artwork was added to the site