// Import mongoose 
const mongoose = require('mongoose');

const ArtistsSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        profile: {
            type: String
        },
        artwork: {
            type: Array
        },
        date: {
            type: Date,
            default: Date.now
        }
});

const ArtistsModel = mongoose.model('artists', ArtistsSchema);
module.exports = ArtistsModel;

// email = email address of the artist (link field to users list)
// profile = a profile description of the artist
// artwork = array of artwork the artist has submitted (array of id's from products list)
// date = date the artist registered on the site