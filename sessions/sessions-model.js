const db= require("../data/db-config");

module.exports = {
    getSessionBy,
    add,
    setSessionPaid,
    isSessionPaid
}

function getSessionBy(filter) {
    return db('sessions').where(filter)
}

function add(session) {
    return db("sessions").insert(session).returning("*")
}

function setSessionPaid(id) {
    return db("sessions").where({id}).update({paid: true}).returning("*")
}

function isSessionPaid(id) {
    return db("sessions").where({id}).first().paid
}