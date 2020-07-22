// Import express module into server
const express = require('express'); // require only works with Node.js
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// import dotenv
require('dotenv').config();
// Bring in environment variable for the secret hash
// (needed to read the jsonwebtoken)
const secret = process.env.SECRET;

// Import database models
const UsersModel = require('../models/UsersModel');

// register a user
// A POST route for saving data into the 'users'collection
router.post(
    '/register',     // http://localhost:8080/users/register
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mPhone: req.body.mPhone,
            aPhone: req.body.aPhone,
            country: req.body.country,
            city: req.body.city,
            password: req.body.password,
            accountType: req.body.accountType,
            interests: req.body.interests,
            avatar: req.body.avatar
        };

        // first lets check if the email already exists as we will use this as the unique identifier for all users
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                if(err) {
                    res.json({message: 'error registering user'});    
                    console.log(err);
                } else {

                    // If there's already a document with that email, reject the new user request
                    if(document) {
                        res.json({message: "User already exists"});
                    }

                    // Otherwise create the new user account
                    else {
                        // may need to recreate the formData info as it may be wiped after first find call
                        // 1) Generate a salt
                        bcrypt.genSalt(
                            (err, salt) => {
                            
                                // 2) Generate a hash
                                bcrypt.hash(
                                    formData.password, // first ingredient
                                    salt, // second ingredient
                                    (err, hashedPassword) => {
                                    
                                        // Set the variabe or the formdata model
                                        const newUsersModel = new UsersModel(formData);
                                    
                                        // Step 3) Replace the original password with the hashed password
                                        newUsersModel.password = hashedPassword;
                                    
                                        // Step 4) Save user data to database (with encrypted password)
                                        newUsersModel.save(
                                            (err, dbResult) => {
                                            
                                                // If something goes wrong, send error
                                                if(err) {
                                                    res.json({message: err});
                                                }
                                                // Otherwise, send success message
                                                else {
                                                    res.json({message: "User created"});
                                                }
                                            }
                                        );

                                    }
                                )
                            }
                        );
                    }
                }
            }
        );
    
    }
)

// /login
// A POST route for saving data into the 'users'collection
router.post(
    '/login',
    (req, res) => {

        // npm packages: passport, passport-jwt, jsonwebtoken

        // Step 1. Capture formData (email & password)
        const formData = {
            email: req.body.email,
            password: req.body.password
        }


        // Step 2a. In database, find account that matches email
        // .find to find multiple documents, .findOne to find one document
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                // Step 2b. If email NOT match, reject the login request
                if(!document) {
                    res.json({message: "Please check email or password"});
                }

                // Step 3. If there's matching email, examine the document's password
                else {

                    // Step 4. Compare the encrypted password in db with incoming password
                    bcrypt.compare(formData.password, document.password)
                    .then(
                        (isMatch) => {

                            // Step 5a. If the password matches, generate web token (JWT)
                            if(isMatch === true) {
                                // Step 6. Send the JWT to the client
                                // generate the payload
                                const payload = { 
                                    id: document.id,
                                    firstName: document.firstName,
                                    lastName: document.lastName,
                                    email: document.email,
                                    mPhone: document.mPhone,
                                    aPhone: document.aPhone,
                                    country: document.country,
                                    city: document.city,
                                    accountType: document.accountType,
                                    avatar: document.avatar
                                };

                                // Sign the payload with the secret key and send to user
                                jwt.sign(
                                    payload,
                                    secret,
                                    (err, jsonwebtoken) => {
                                        res.json(
                                            {
                                                message: 'Login successful',
                                                jsonwebtoken: jsonwebtoken
                                            }
                                        )
                                    }
                                )

                            }

                            // Step 5b. If password NOT match, reject login request
                            else {
                                res.json({message: "Login NOT successful"})
                            }
                        }
                    )
                }
                

            }
        )
    }
)

// POST route to update user info
router.post(
    '/update',
    (req, res) => {

        // set up the users data to update
        const usersData = {
            _id: req.user._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mPhone: req.body.mPhone,
            aPhone: req.body.aPhone,
            country: req.body.country,
            city: req.body.city,
            password: req.body.password,
            accountType: req.body.accountType,
            interests: req.body.interests,
            avatar: req.body.avatar
        };

        // 1) In database, find the user that matches the user id provided
        UsersModel.findOneAndUpdate(
            {_id: usersData._id },  // search criteria
            {                           // criteria (keys and values) to update
                firstName: usersData.firstName,
                lastName: usersData.lastName,
                email: usersData.email,
                mPhone: usersData.mPhone,
                aPhone: usersData.aPhone,
                country: usersData.country,
                city: usersData.city,
                password: usersData.password,
                accountType: usersData.accountType,
                interests: usersData.interests,
                avatar: usersData.avatar},
            {useFindAndModify: false,
             new: true}, // options, if any
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    // 2) If no document with the user id, say can't find user
                     if(!document) {
                        res.json({message: 'User not found'});
                    }
                
                    else {      // 3) Otherwise, if user is found, return success message
                        res.json(
                            {
                                message: 'User updated',
                                document: document
                            }
                        )
                    }
                }
            }
        );
    }
);

// A GET route for fetching data from the 'users'collection
router.get(
    '/userSettings',
    (req, res) => {
        const usersData = {_id: req.user._id}

        // fetch the documents using .find() and id
        UsersModel.find(
            {_id: usersData._id },  // search criteria
            {                           // criteria (keys and values) to return
                firstName: usersData.firstName,
                lastName: usersData.lastName,
                email: usersData.email,
                mPhone: usersData.mPhone,
                aPhone: usersData.aPhone,
                country: usersData.country,
                city: usersData.city,
                password: usersData.password,
                accountType: usersData.accountType,
                interests: usersData.interests,
                avatar: usersData.avatar},
            {}, // options, if any
            (err, document) => {

                if(err) {
                    console.log(err);
                } else {
                    // 2) If no document with the user id, say can't find user
                     if(!document) {
                        res.json({message: 'User not found'});
                    }
                
                    else {      // 3) Otherwise, if user is found, return all user data
                        res.json({userSettings: document})
                    }
                }
            }
        );

    }
);

module.exports = router;