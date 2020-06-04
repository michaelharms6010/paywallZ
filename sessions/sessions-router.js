const router = require("express").Router();
const Sessions = require("./sessions-model")
router.get("/", (req, res) => {
    Sessions.getSessions().then(sessions => {
        sessionses.status(200).json(sessions)
    }).catch(err => res.status(500))
})

router.post("/", (req,res) => {
    const newSession = req.body;
    Sessions.add(newSession).then(newsession => {
        res.status(201).json(newSession)
    }).catch(err => res.status(500))
})