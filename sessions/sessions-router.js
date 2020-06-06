const router = require("express").Router();
const Sessions = require("./sessions-model")
const bcrypt = require("bcryptjs")

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1014409',
  key: 'c7b887928299ea61ebff',
  secret: '01c685d24b3e53f8fcbc',
  cluster: 'us2',
  encrypted: true
});



router.get("/", (req, res) => {

    Sessions.getSessions().then(sessions => {
        res.status(200).json(sessions)
    }).catch(err => res.status(500))
})

router.post("/new", (req,res) => {
    const newSession = req.body;
    console.log(newSession)
    newSession.hash = bcrypt.hashSync(String(Math.random()), 5)

    Sessions.add(newSession).then(newsession => {
        res.status(201).send("<h1>Paywall</h1>")
    }).catch(err => res.status(500).json({message:'error'}))
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