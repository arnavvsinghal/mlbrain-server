const handleRegister = (req, res, knex, bcrypt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Invalid');
    }
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
}

module.exports = {
    handleRegister: handleRegister
}