// Import express module into server
const express = require('express'); // require only works with Node.js
const router = express.Router();

// Import database models
const ArtistsModel = require('../models/ArtistsModel');
const UsersModel = require('../models/UsersModel');

// register an artist
// A POST route for saving data into the 'artists'collection
router.post(
    '/register',     // http://localhost:8080/users/register
    (req, res) => {
        const formData = {
            email: req.body.email,
            profile: req.body.profile,
            artwork: req.body.artwork
        };

        // first check artist is registered user
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                // If no user, reject creation of the artist
                if(!document) {
                    res.json({message: "User does not exist"});
                }

                // Otherwise check if there is an artist account
                else {
                    ArtistsModel.findOne(
                        {email: formData.email},
                        (err, document) => {
            
                            // If artist does not already exist, create artist account
                            if(!document) {
                                // Set the formdata model
                                const newArtistsModel = new ArtistsModel(formData);

                                // Save artist data to database
                                newArtistsModel.save(
                                    (err, dbResult) => {

                                        // If something goes wrong, send error
                                        if(err) {
                                            res.json({message: err});
                                        }

                                        // Otherwise, send success message
                                        else {
                                            res.json({message: "Artist created"});
                                        }
                                    }
                                );
                            }
                            // Otherwise, send message saying artist already exists
                            else {
                                res.json({message: "Artist already exists"});
                            }
                     }
                    );
                }
            }
        );   
    }
)

// POST route to update artist info
router.post(
    '/update',
    (req, res) => {

        // set up the artists data to update (does not include artwork)
        const artistsData = {
            email: req.body.email,
            profile: req.body.profile
        };

        // 1) In database, find the user that matches the artist id provided
        ArtistsModel.findOneAndUpdate(
            {email: artistsData.email },  // search criteria
            {                           // criteria (keys and values) to update (cannot update artwork via this route)
                profile: artistsData.profile},
            {useFindAndModify: false,
             new: true}, // options, if any
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    // 2) If no document with the user id, say can't find user
                     if(!document) {
                        res.json({message: 'Artist not found'});
                    }
                
                    else {      // 3) Otherwise, if user is found, return success message
                        res.json(
                            {
                                message: 'Artist updated',
                                document: document
                            }
                        )
                    }
                }
            }
        );
    }
);

// POST route to add artwork for an artist
router.post(
    '/addArt',
    (req, res) => {
        const formData = { 
            email: req.body.email,
            artwork: req.body.artwork
            };

        // 1) In database, find the artist that matches the id provided
        ArtistsModel.findOne(
            {email: req.body.email },
            (err, document) => {

                if(err) {
                    // If error, return an error and send message to console
                    res.json({message: 'error updating artwork'});
                    console.log(err);
                } else {

                    // 2) If no artist found with the id, return 'not found'message
                    if(!document) {
                        res.json({message: 'Artist not found'});
                    }

                    else {      // 3) Check if art already assigned to artist

                        if(document.artwork.includes(req.body.artwork)) {
                            // return message saying artwork already assigned
                            res.json({message: 'Artwork already included'});
                        }

                        // If not, add ($push) the artwork to the artists list of artwork
                        else {
                            ArtistsModel.updateOne(
                                {email: document.email},
                                { $push: {artwork: formData.artwork }},
                                (err) => {
                                    if(err) {
                                        // if error, return an error and send message to console
                                        res.json({message: 'error adding artwork'});
                                        console.log(err);
                                    }
                                }
                            );
                            // otherwise return message saying artwork added
                            res.json({message: 'Artwork added'});
                        }
                    }
                }
            }
        );
    }
);

// POST route to remove artwork for an artist
router.post(
    '/deleteArt',
    (req, res) => {
        const formData = { 
            email: req.body.email,
            artwork: req.body.artwork
            };

        // 1) In database, find the artist that matches the id provided
        ArtistsModel.findOne(
            {email: req.body.email },
            (err, document) => {

                // 2) If no artist found with the id, return 'not found'message
                if(!document) {
                    res.json({message: 'Artist not found'});
                }
                
                else {      // 3) Check if art assigned to artist

                    if(!document.artwork.includes(req.body.artwork)) {
                        // return message saying artwork already assigned
                        res.json({message: 'Artwork not found'});
                    }

                    // If artwork exists for artist then remove it from artists list of artwork ($pull)
                    else {
                        ArtistsModel.updateOne(
                            {email: document.email},
                            { $pull: {artwork: formData.artwork }},
                            (err) => {
                                if(err) {
                                    // if error, return an error and send message to console
                                    res.json({message: 'error removing artwork'});
                                    console.log(err);
                                    }
                                else {
                                    // otherwise return message saying artwork added
                                    res.json({message: 'Artwork removed'});
                                }
                            }
                        );
                    }
                }
            }
        );
    }
);


// A GET route for fetching artists data from the 'artists'collection
router.get(
    '/list',
    (req, res) => {

        // 1) fetch all the documents using .find()
        ArtistsModel.find()

        // 2) Once the results are ready, use .json() to send the results
        .then (
            (results) => {
                // res.json = res.send() + converts to JSON
                res.json(results)
            }
        )

        // if error then display it
        .catch(
            (e) => {
                res.json({message: "error fetching artists"});
                console.log(e);
            }
        )

    }
);


module.exports = router;