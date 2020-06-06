const db = require("../data/db-config");

module.exports = {
    add, 
    getAll,
    findBy
}

function add(txn) {
    return db("txns").insert(txn).returning("*")
}
function getAll() {
    return db("txns")
}
function findBy(filter) {
    return db("txns").where(filter)
}