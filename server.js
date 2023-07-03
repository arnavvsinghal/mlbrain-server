const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'mlbrain'
    }
});


const app = express();
const port = 3000;

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

app.use(express.json());
app.use(cors());
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