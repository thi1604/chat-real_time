const express = require("express");
const route = express.Router();
const controller = require("../../controller/client/chat.controller.js");
const isAccessMiddlewares = require("../../middlewares/client/isAccess.middlewares");

route.get("/:id",
  isAccessMiddlewares,
  controller.chat
);

module.exports = route;