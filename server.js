//***********************************************/
//* Install/import packages we are going to use */
//***********************************************/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Import the strategies & way to extract the jsonwebtoken
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// import dotenv
require('dotenv').config();

// import cors for front & backend communications
const cors = require('cors');

// Bring in environment variable for the secret hash
// (needed to read the jsonwebtoken)
const secret = process.env.SECRET;

// Set up UsersModel so we can find the user in the database with the passport function
const UsersModel = require('./models/UsersModel');

// Set up options for passport-jwt
const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

//**********************/
//* Passport function */
//*********************/
// This function will read the payload of the jsonwebtoken
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions, 
            (jwtPayload, done) => {

                // Extract and find the user by their id (contained jwt)
                UsersModel.findOne({ _id: jwtPayload.id })
                .then(
                    // If the document was found
                    (document) => {
                        return done(null, document);
                    }
                )
                .catch(
                    // If something went wrong with database search
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

// Import routes 
const ProductsRoutes = require('./routes/ProductsRoutes');
const EventsRoutes = require('./routes/EventsRoutes');
const UsersRoutes = require('./routes/UsersRoutes');
const ArtistsRoutes = require('./routes/ArtistsRoutes');
const NewsletterRoutes = require('./routes/NewsletterRoutes.js');

// Utilities routes currently not active
//const UtilitiesRoutes = require('./routes/UtilitiesRoutes.js');

// Create the server object
const server = express();

// Configure express to use body-parser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Initialize the passport utility for login
server.use(passport.initialize());

// initiate cors to allow backend and frontend to communicate
server.use(cors());

// Invoke passportJwt and pass the passport npm package as argument
passportJwt(passport);

// Use environment variable db_URL to connect to the database
const dbURL = process.env.db_URL;

// ----------------------------------------------
// | connect to MongoDB database using mongoose |
// ----------------------------------------------
// 
mongoose.connect(
    dbURL,
    {
        'useNewUrlParser': true,
        'useUnifiedTopology': true
    }
).then(
    ()=>{
        console.log('You are connected MongoDB');
    }
).catch(
    (e)=>{
        console.log('Failed to connect to MongoDB', e);
    }
);

// ----------------------------
// | Configure routes on site |
// ----------------------------
//
// Products routes
server.use(
    '/products', // translates to http://localhost:8080/products
//    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
    ProductsRoutes
);

// Events routes - requires jwt passport token
server.use(
    '/events',  // translates to http://localhost:8080/events
    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
    EventsRoutes
);

// ** Currently inactive ** Utilities routes - requires jwt passport token
//server.use(
//    '/utilities',  // translates to http://localhost:8080/utilities
//    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
//    UtilitiesRoutes
//);

// Users routes
server.use(
    '/users',  // translates to http://localhost:8080/users
    UsersRoutes
);

// Artist routes
server.use(
    '/artists',  // translates to http://localhost:8080/artists
    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
    ArtistsRoutes
);

// Newsletter routes
server.use(
    '/newsletter',  // translates to http://localhost:8080/newsletter
    NewsletterRoutes
)


//*******************/
//* 404 error page */
//******************/
// At the end include a catch all for any other pages not detailed above to display an error page
server.get(
   '*',
   (req, res) => {
       res.send("<h1> ERROR 404</h1></br></br><h3>Page not found</h3>");
   }
);


// laptop local service: http://127.0.0.1:8080 (aka http://localhost:8080)
// connect to port (range 3000 to 9999)
// port 8080 is usually available
// some applications use specific port numbers
// this is a call back function
// this particular function is only for the develop to know that the connection has been established
// this should be the last thing in the file as it will hang the file waiting for an exit
server.listen( 
    8080, ()=>{
        console.log('You are connected http://127.0.0.1:8080!');
    }
);