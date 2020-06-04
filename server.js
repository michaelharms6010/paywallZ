const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

server.use("/auth", authRouter)
server.use("/users", userRouter)

server.get("/", (req,res) => {
    res.json({message: "Server is up and running"})
})

module.exports = server;