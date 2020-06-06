const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sessionRouter = require("./sessions/sessions-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));
server.use("/sessions", sessionRouter)

server.get("/", (req,res) => {
    res.json({message: "Server is up and running"})
})

module.exports = server;