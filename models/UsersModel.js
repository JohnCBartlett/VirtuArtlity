// Import mongoose 
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mPhone: {
            type: Number
        },
        aPhone: {
            type: Number
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        accountType: {
            type: Array,
            required: true
        },
        interests: {
            type: Array
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

const UsersModel = mongoose.model('users', UsersSchema);
module.exports = UsersModel;

// firstname (required) = first name ofregistered user
// lastname (required) = surname (family name) of registered user
// email (required) = email address of registered user
// mPhone = mobile phone number of registered user
// aPhone = alternate phone number of registered user
// country = country where registered user resides (currently)
// password (required) = password
// accountType (required) = account types for registered user (e.g. user, artist, admin, etc.)
// interests = site interests of the registered user (e.g. sculpture, events, paintings, etc.)
// avatar = image for profile, reference or location (e.g. http address or similar) for the avatar
// date (default, required) = date and time the registered user was registered on the systems