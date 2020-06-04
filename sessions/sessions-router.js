const router = require("express").Router();
const Sessions = require("./sessions-model")
router.get("/", (req, res) => {
    Sessions.getSessions().then(sessions => {
        sessionses.status(200).json(sessions)
    })

})