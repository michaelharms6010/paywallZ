const db = require("../data/db-config");

module.exports = {
    add,
    getAll,
    findBy
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