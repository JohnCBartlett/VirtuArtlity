// Import express module into server
const express = require('express'); // require only works with Node.js
const router = express.Router();
const bcrypt = require('bcrypt');

// Import database models
const UsersModel = require('../models/UsersModel');


// /password
// A POST route for returning a message for password validation
router.post(
    '/pwdcheck',
    (req, res) => {

        // Step 1. Capture formData (email & password)
        const formData = {
            email: req.body.email,
            password: req.body.password
        }
        
        res.send(req.user.id);
        // Step 2a. In database, find account that matches current user id
        UsersModel.findOne(
            {email: formData.email},
            (err, document) => {

                // Step 2b. If id not found, return message
                if(!document) {
                    res.json({message: "No registered user"});
                }

                // Step 3. If there's matching id, examine the document's password
                else {

                    // Step 4. Compare the encrypted password in db with incoming password
                    bcrypt.compare(formData.password, document.password)
                    .then(
                        (isMatch) => {

                            // Step 5a. If the password matches, respond positively
                            if(isMatch === true) {
                                res.json({message: "match true"})
                            }

                            // Step 5b. If password NOT match, respond negatively
                            else {
                                res.json({message: "match false"})
                            }
                        }
                    )
                            // if error then display it
                    .catch(
                        (e) => {
                             res.json({message: "error fetching products"});
                            console.log(e);
                        }
                    )
                    
                }
                

            }
        )
    }
)

module.exports = router;