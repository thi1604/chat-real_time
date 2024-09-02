const express = require("express");
const route = express.Router();
const controller = require("../../controller/client/chat.controller.js");
const isAccessMiddlewares = require("../../middlewares/client/isAccess.middlewares");

route.get("/:id", isAccessMiddlewares, controller.chat);

route.get("/:id/change-title", isAccessMiddlewares, controller.changeTitle);
route.patch("/:id/change-title", isAccessMiddlewares, controller.changeTitlePatch);

module.exports = route;