const router = require("express").Router();
const Sessions = require("./sessions-model")
router.get("/", (req, res) => {
    Sessions.getSessions().then(sessions => {
        res.status(200).json(sessions)
    }).catch(err => res.status(500))
})

router.post("/", (req,res) => {
    const newSession = req.body;
    Sessions.add(newSession).then(newsession => {
        res.status(201).json(newSession)
    }).catch(err => res.status(500))
})

router.get("/paywall", (req,res) => {
    res.render(<h1>Paywall Form</h1>)
})

router.get("/content", (req,res) => {
    res.render(<h1>Content</h1>)
})

router.put("/:id")