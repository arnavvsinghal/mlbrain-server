const handleImage=(req, res, knex) => {
    const { id } = req.body;
    // This has to be learned. Here the funciton updates the entries.
    knex('users').where({
        id: id
    }).increment('entries', 1)
        .returning('entries')
        .then((entries) => { res.json(entries[0].entries) })
        .catch((err) => { res.status(400).json('Unable to retrieve entries') })
}
module.exports ={
    handleImage: handleImage
}