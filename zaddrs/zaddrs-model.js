const db = require("../data/db-config");

module.exports = {
    add,
    getAll,
    findBy,
    setActive,
    setAvailable
}

function add(zaddr) {
    return db("zaddrs").insert(zaddr)
}

function getAll() {
    return db("zaddrs")
}

function findBy(filter) {
    return db("zaddrs").where(filter)
}

function setActive(zaddr) {
    return db("zaddrs").where({zaddr}).update({active: true}).returning("*")
}

function setAvailable(zaddr) {
    return db("zaddrs").where({zaddr}).update({active: false}).returning("*")
}