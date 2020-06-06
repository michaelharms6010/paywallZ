const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const {listen, zaddrCheck, sessionCheck} = require("./utils/daemon");

const sessionRouter = require("./sessions/sessions-router");

const server = express();

zaddrCheck();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));
server.use("/sessions", sessionRouter)

server.get("/", (req,res) => {
    res.json({message: "Server is up and running"})
})

setInterval(listen, 3000);
setInterval(sessionCheck, 60000)

module.exports = server;