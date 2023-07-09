const handleRegister = (req, res, knex, bcrypt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Invalid');
    }
    const hash = bcrypt.hashSync(password);
// hashes the password
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
            // In Knex.js, a transaction is a way to group database operations together as a single unit of work. Transactions provide a mechanism to ensure that a set of related database operations either all succeed or all fail together.A transaction in Knex.js allows you to perform multiple database operations as a single logical operation. If any part of the transaction fails, all changes made within the transaction are undone, and the database is left in its original state.
    })
        .catch(err => res.status(400).json("Unable to register"));
}

module.exports = {
    handleRegister: handleRegister
}