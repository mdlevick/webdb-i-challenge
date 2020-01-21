const express = require("express");

const AccountRouter = require("./accounts/router.js");

// const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h3>Monday, December 9th Project.</h3>");
});

server.use("/api/accounts", AccountRouter);

module.exports = server;