// Import express into the file
const express = require('express');
const router = express.Router();
const EventsModel = require('../models/EventsModel.js');

router.post(
    '/creation',
    (req, res)=>{
        const formData = {
            title: req.body.title,
            description: req.body.description,
            eventType: req.body.eventType,
            venue: req.body.venue,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            artists: req.body.artists,
            artwork: req.body.artwork,
            attendees: req.body.attendees
        }

       // check if event with that criteria already exists
       EventsModel.findOne(
            {title: formData.title,
             eventType: req.body.eventType,
             venue: req.body.venue,
             eventDate: req.body.eventDate,
             eventTime: req.body.eventTime},
            (err, document) => {

                // If no event found then create event
                if(!document) {

                    // Save event to database (events collection)
                    const newEventsModel = new EventsModel(formData);
                    newEventsModel.save()

                    // if successful then return success message
                    .then (
                        () => {
                        res.json({message: 'Event created'});
                        }
                    )
                    
                    // if error then return error message and post error to console log
                    .catch(
                        (e) => {
                            res.json({message: 'Event creation failed'});
                            console.log(e);
                        }
                    )
                }
                else {
                    // otherwise return message saying event already exists
                    res.json({message: 'Event already exists'});
                }
            }
        );
    }
);

// POST route to add user to an event
router.post(
    '/addDelegate',
    (req, res) => {
        const formData = { 
            id: req.body.id
            };

        // 1) find the event that matches the id provided
        EventsModel.findOne(
            {_id: req.body.id },
            (err, document) => {
                
                if(err) {
                    // if error, return an error and send message to console
                    res.json({message: 'error updating product'});
                    console.log(err);
                } else {

                    // 2) If no event found with the id, return 'not found'message
                    if(!document) {
                        res.json({message: 'Event not found'});
                    }

                    else {      // 3) Check if user already registered for the event

                        if(document.attendees.includes(req.user._id)) {

                            // If already exists, return message saying attendee already registered
                            res.json({message: 'User already registered'});
                        }

                        // If not registered, add ($push) user to attendees list for the event
                        else {
                            EventsModel.updateOne(
                                {_id: document._id},
                                { $push: {attendees: [req.user.id] }},
                                (err) => {
                                    if(err) {
                                        // if error, return an error and send message to console
                                        res.json({message: 'error adding attendee'});
                                        console.log(err);
                                    }
                                }
                            );
                            // otherwise return message saying attendee added
                            res.json({message: 'Attendee added'});
                        }
                    }
                }
            }
        );
    }
);

// POST route to remove user from event
router.post(
    '/deleteDelegate',
    (req, res) => {
        const formData = { 
            id: req.body.id
            };

        // 1) In database, find the event that matches the id provided
        EventsModel.findOne(
            {_id: req.body.id },
            (err, document) => {

                if(err) {
                    // if error, return an error and send message to console
                    res.json({message: 'error updating product'});
                    console.log(err);
                } else {

                    // 2) If no event found with the id, return 'not found'message
                    if(!document) {
                        res.json({message: 'Event not found'});
                    }

                    else {      // 3) Check if user already attending event

                        if(document.attendees.includes(req.user._id)) {

                            // If user listed, then remove from attendess list ($pull)
                            EventsModel.updateOne(
                                {_id: document._id},
                                { $pull: {attendees: req.user.id }},
                                (err) => {
                                    if(err) {
                                        // if error, return an error and send message to console
                                        res.json({message: 'error removing attendee'});
                                        console.log(err);
                                        }
                                }
                            );
                            // otherwise return message saying attendee removed
                            res.json({message: 'Attendee removed'});
                        }
                        else {
                            // if not listed, return message saying attendee not registered
                            res.json({message: 'Attendee not listed'});
                        }
                    }
                }
            }
        );
    }
);

// A GET route for fetching data from the 'events'collection
router.get(
    '/list',
    (req, res) => {

        // fetch all the documents using .find()
        EventsModel.find()

        // Once the results are ready, use .json() to send the results
        .then (
            (results) => {
                // res.json = res.send() + converts to JSON
                res.json(results)
            }
        )

        // if error then display it
        .catch(
            (e) => {
                res.json({message: "error fetching events"});
                console.log(e);
            }
        )

    }
);

module.exports = router;