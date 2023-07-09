const express = require('express');
// simplifies the process of handling requests by providing a set of tools and functions that help us handle different types of requests (like getting data, sending data, or uploading files) and create routes (like different paths on a website).
const cors = require('cors');
// CORS stands for Cross-Origin Resource Sharing. It is a mechanism that allows web browsers to securely make requests to a different domain than the one from which the original web page was served.

// By default, web browsers implement a security feature called the Same-Origin Policy, which restricts web pages from making requests to a different domain. 
const bcrypt = require('bcrypt-nodejs');
//used for hashing passwords

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'mlbrain'
    }
});
// Knex is a JS query builder for Node.js that allows us to interact with relational databases.It provides an abstraction layer on top of database drivers, making it easier to write database queries and perform common operations like inserting, updating, deleting, and querying data.

const app = express();
const port = 3000;

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

app.use(express.json());
// app.use() is middleware that is used to parse incoming request bodies.
// Here's, how express.json() works:

// It checks if the request has a content type of "application/json". 
// If the content type matches, it proceeds with reading the raw request body and parsing it into a JavaScript object.Thus, making the data accessible for further processing.
// It attaches the parsed JSON object to the req.body property of the incoming request object. This allows us to access the parsed data in our route handlers using req.body.

app.use(cors());
// It use is mentioned above and working is out of scope.

app.get('/', (req, res) => {
    res.send('success');
});

app.post('/signin', (req, res) => { signin.handleSigninRequest(req, res, knex, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, knex) });

app.put('/image', (req, res) => { image.handleImage(req, res, knex) });

app.listen(port, () => {
    console.log(`The app is listening on ${port}`);
});