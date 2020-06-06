const db= require("../data/db-config");

module.exports = {
    getSessionBy,
    add,
    setSessionPaid,
    isSessionPaid,
    getSessions
}

function getSessions() {
    return db("sessions")
}

function getSessionBy(filter) {
    return db('sessions').where(filter)
}

function add(session) {
    return db("sessions").insert(session).returning("*")
}

async function setSessionPaid(id) {
    // return db("sessions").where({id}).update({paid: true}).returning("*")
    await db('sessions').where({id}).update({paid: true})
    return db("sessions").where({id})
}

function isSessionPaid(id) {
    return db("sessions").where({id}).first().paid
}