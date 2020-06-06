const db= require("../data/db-config");
const Zaddrs = require("../zaddrs/zaddrs-model");

module.exports = {
    getSessionBy,
    add,
    setSessionPaid,
    isSessionPaid,
    getSessions,
    findBy
}

function findBy(filter) {
    return db("sessions").where({filter})
}

function getSessions() {
    return db("sessions")
}

function getSessionBy(filter) {
    return db('sessions').where(filter)
}

async function add(session) {
    const zaddr = await Zaddrs.findBy({active:false}).first()
    await Zaddrs.setActive(zaddr.zaddr)
    session.zaddr = zaddr.zaddr
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

function remove(id) {
    return db("sessions").where({id}).del()
}