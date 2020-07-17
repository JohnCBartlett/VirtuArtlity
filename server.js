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

// import cors for front & backend communications
const cors = require('cors');

// Setup secret to read jsonwebtoken (must be same as Secret in UsersRoutes)
const secret = "s3cr3t";

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

// Enter your database connection URL
//
// need to add database connection string here:
// ****************************************
const dbURL = "mongodb+srv://admin01:Astr0labz@virtuartlity.95m9h.mongodb.net/VirtuArtlity?retryWrites=true&w=majority"
// ****************************************

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
    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
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
// These are just some dummy pages until we can hook up the React landing page
// create a route for the landing page
// '/' refers to the HTML/landing page
// Added some links to other pages (note the + and syntax to link lines)
//

//***************/
// Landing page */
//***************/
server.get(
    '/',
    (req, res) => {
        res.send(
            "<h1> Welcome to MyCars.com</h1>" +
            "<a href='/about'>About</br></a>" +
            "<a href='/products'>Products</br></a>" +
            "<a href='/contact'>Contact details</br></a>"
            );
    }
);

//*************************************/
//* create a route for the about page */
//*************************************/
server.get(
   '/about',
   (req, res) => {
       res.send(
           "<h1> About us</h1>" +
       "<a href='/'>Home</a>");
   }
);

//***************************************/
//* create a route for the contact page */
//***************************************/
server.get(
   '/contact',
   (req, res) => {
       res.send("<h1> These are my contact details</h1>" +
       "<h3></br>Telephone: 433636363 " +
       "</br>Address: fhfhgddhh</br></br></h3>" +
       "<a href='/'>Home</a>");
   }
);

//****************************************/
//* create a route for the products page */
//****************************************/
server.get(
   '/products',
   (req, res) => {
       res.send("<h1> This is my product page</h1>" +
       "</br><h3>item 1 " +
       "</br>item 2</br></br></h3>"  +
       "<a href='/'>Home</a>");
   }
);

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