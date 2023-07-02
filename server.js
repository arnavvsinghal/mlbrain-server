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

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send(db.user);
});

app.post('/signin', (req, res) => {
    const {email,password}=req.body;
    knex.select('email','hash').from('login')
    .where({
        email:email
    }).then(data=>{
        const isValid=bcrypt.compareSync(password,data[0].hash);
        if(isValid)
        {
            return knex.select('*').from('users')
            .where({
                email:email
            })
            .then(user=>{
                res.json(user[0])
            })
            .catch(err=>res.status(400).json('Unable to find user'))
        }
        else{
            res.status(400).json('Wrong Credentials');
        }
    })
    .catch(err=>res.status(400).json('Wrong Credentials'))
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);

    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return knex('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .catch(err => res.status(400).json("Unable to register"));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('users').where({
        id: id
    })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            }
            else {
                res.status(400).json('Not Found');
            }
        })
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    knex('users').where({
        id: id
    }).increment('entries', 1)
        .returning('entries')
        .then((entries) => { res.json(entries[0].entries) })
        .catch((err) => { res.status(400).json('Unable to retrieve entries') })
})
app.listen(port, () => {
    console.log(`The app is listening on ${port}`);
});