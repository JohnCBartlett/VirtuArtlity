// Import mongoose 
const mongoose = require('mongoose');

// set up schema structure
const NewsletterSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        marketing: {
            type: Boolean,
            default: false
        },
        sharing: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

const NewsletterModel = mongoose.model('newsletter', NewsletterSchema);
module.exports = NewsletterModel;

// Email is thhe email address of some interested in receiving the newsletter
// Marketing = boolean, indicating whether they have agreed to receive marketing emails/circulars
// Sharing indicates whether they have agreed for their email tobe shared with artists for inmarketing
// date is the date the newsletter register was made