// Import mongoose 
const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        eventType: {
            type: String
        },
        venue: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        eventDate: {
            type: String
        },
        eventTime: {
            type: String
        },
        artists: {
            type: Array
        },
        artwork: {
            type: Array
        },
        attendees: {
            type: Array
        },
        date: {
            type: Date,
            default: Date.now
        }
});

const EventsModel = mongoose.model('events', EventsSchema);
module.exports = EventsModel;

// title = title of the event
// description = a description of the event
// eventType = the type of event (e.g. webinar, launch, gallery opening, exhibition, etc.)
// venue = venue name for the event
// address = the address of the venue
// city = city of the venue & event
// country = country locaytion of the event
// eventDate = date of the event
// eventTime = time of the event
// artists = the id's of the artists involved in the event
// artwork = the id's of the artwork to be displayed at the event
// date = date the event was registered on the site