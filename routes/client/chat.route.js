const express = require("express");

const route = express.Router();
const controller = require("../../controller/client/chat.controller.js");

route.get("/:id", controller.chat);

module.exports = route;