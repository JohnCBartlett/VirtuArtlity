// Import express module into server
const express = require('express'); // require only works with Node.js
const router = express.Router();

// Import database models
const ProductsModel = require('../models/ProductsModel');

// A POST route for saving data into the 'products'collection
router.post(
    '/post',
    (req, res) => {
        const productData = {
            title: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            artType: req.body.artType,
            genre: req.body.genre,
            availability: req.body.availability,
            likes: req.body.likes,
            image: req.body.image,
            price: req.body.price,
            quantity: req.body.quantity
        };

        // check if a product with that title for that artists already exists
        ProductsModel.findOne(
            {title: productData.title,
             artist: productData.artist},
            (err, document) => {

                if(err) {
                    // if error, return an error and send message to console
                    res.json({message: 'error updating product'});
                    console.log(err);
                } else {

                    // If no product found with title & artist then save product
                    if(!document) {

                        // Save the data to database (products collection)
                        const newProductModel = new ProductsModel(productData);
                        newProductModel.save()

                        // if successful then return success messages
                        .then (
                            () => {
                            res.json({message: 'Product POST successfull'});
                            }
                        )
                        
                        // if error then return error message and post error to console log
                        .catch(
                            (e) => {
                                res.json({message: 'Product POST failed'});
                                console.log(e);
                            }
                        )
                    }
                    else {
                        // otherwise return message saying product already exists
                        res.json({message: 'Product already exists'});
                    }
                }
            }
        );
    }
);


// POST route to update products info
router.post(
    '/update',
    (req, res) => {

        // set up to route to receive the feeds id
        const productData = {
            _id: req.body._id,
            title: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            artType: req.body.artType,
            genre: req.body.genre,
            availability: req.body.availability,
            likes: req.body.likes,
            image: req.body.image,
            price: req.body.price,
            quantity: req.body.quantity
        };

        // 1) In database, find the product that matches the product id provided
        ProductsModel.findOneAndUpdate(
            {_id: productData._id },  // search criteria
            {                           // criteria (keys and values) to update
                title: productData.title,
                artist: productData.artist,
                description: productData.description,
                artType: productData.artType,
                genre: productData.genre,
                availability: productData.availability,
                likes: productData.likes,
                image: productData.image,
                price: productData.price,
                quantity: productData.quantity},
            {useFindAndModify: false,
             new: true}, // options, if any
            (err, document) => {

                if(err) {
                    // if error, return an error and send message to console
                    res.json({message: 'error updating product'});
                    console.log(err);
                } else {
                    // 2) If no document is found with the product id, return failure message
                     if(!document) {
                        res.json({message: 'Product not found'});
                    }
                
                    else {      // 3) Otherwise, if product found, return success message
                        res.json(
                            {
                                message: 'Product updated',
                                document: document
                            }
                        );
                    }
                }
            }
        );
    }
);


// POST route to add likes to a product
router.post(
    '/like',
    (req, res) => {
        const formData = { 
            id: req.body.id
            };

        // In database, find the product that matches the id provided
        ProductsModel.findOne(
            {_id: req.body.id },
            (err, document) => {
                
                if(err) {
                    // If error, return an error and send message to console
                    res.json({message: 'error updating product'});
                    console.log(err);
                } else {

                   // If no product found with the id, return 'not found'message
                   if(!document) {
                       res.json({message: 'Product not found'});
                   }

                   else {      // Otherwise, toggle the likes for the product for the user making the like

                       if(document.likes.includes(req.user._id)) {

                           // if the like already exists (user is in likes array) then remove it ($pull)
                           // use $pull rather than $pop in case more than one occurance of user id in the array
                           ProductsModel.updateOne(
                               {_id: document._id},
                               { $pull: { likes: req.user.id }},
                               (err) => {
                                   if(err) {
                                       // if error, return an error and send message to console
                                       res.json({message: 'error changing like'});
                                       console.log(err);
                                       }
                               }
                           );
                           // return message saying like has been removed
                           res.json({message: 'Like removed'});
                       }
                       else {

                           // if the like does not already exists (user not in likes array) then add user id ($push)
                           ProductsModel.updateOne(
                               {_id: document._id},
                               { $push: {likes: [req.user.id] }},
                               (err) => {
                                   if(err) {
                                       // if error, return an error and send message to console
                                       res.json({message: 'error changing like'});
                                       console.log(err);
                                       }
                               }
                           );
                           // otherwise return message saying like has been added
                           res.json({message: 'Like added'});
                       }
                   }
               }
            }
        );
    }
);


// A GET route for fetching data from the 'products'collection
router.get(
    '/list',
    (req, res) => {

        // fetch all the documents using .find()
        ProductsModel.find()

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
                res.json({message: "error fetching products"});
                console.log(e);
            }
        )

    }
);

// Export the router
module.exports = router;
