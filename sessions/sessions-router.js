const router = require("express").Router();
const Sessions = require("./sessions-model")
const bcrypt = require("bcryptjs")

router.get("/", (req, res) => {

    Sessions.getSessions().then(sessions => {
        res.status(200).json(sessions)
    }).catch(err => res.status(500))
})

router.post("/new", async (req,res) => {
    const newSession = req.body;
    console.log(newSession)
    const exists = await Sessions.findBy({contentId: newSession.contentId}).first();
    console.log(exists)
    if (exists) {
        if (exists.paid) {
            res.send('<h1>Content</h1>')
        } else {
            res.status(200).send(`<h1>Send 1 zatoshi to ${exists.zaddr}</h1>`)
        }
    } else {
        newSession.datetime = Date.now();
        newSession.hash = bcrypt.hashSync(String(Math.random()), 5)
        
        Sessions.add(newSession).then(newsession => {
            res.status(201).send(`<h1>Send 1 zatoshi to ${newsession.zaddr}</h1>`)
        }).catch(err => res.status(500).json({message:'error'}))
    }
})

router.post("/paid", (req,res) => {
    const sessionId = req.body.sessionId;
    console.log(sessionId)
    Sessions.setSessionPaid(sessionId).then(newsession => {
        res.status(201).send("<h1>Premium Content</h1>")
    }).catch(err => res.status(500))
})

router.get("/paywall", (req,res) => {
    res.send('<h1>Paywall Form</h1>')
})

router.get("/content", (req,res) => {
    res.send('<h1>Content</h1>')
})

module.exports = router;