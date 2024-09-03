const express = require("express");
const route = express.Router();
const controller = require("../../controller/client/chat.controller.js");
const isAccessMiddlewares = require("../../middlewares/client/isAccess.middlewares");
const upLoadImg = require("../../helper/changeAvatarGroup.helpler");
const multer  = require('multer'); // Day anh len nodejs
const upload = multer();


route.get("/:id", isAccessMiddlewares, controller.chat);

route.get("/:id/change-title", isAccessMiddlewares, controller.changeTitle);

route.patch("/:id/change-title", isAccessMiddlewares, controller.changeTitlePatch);

route.get("/:id/change-name-user", isAccessMiddlewares, controller.changeName);

route.patch("/:id/change-name-user/:idUser", isAccessMiddlewares, controller.changeNamePatch);

route.get("/:id/change-avatar",
 isAccessMiddlewares, 
 controller.changeAvatar);

route.patch("/:id/change-avatar",
 isAccessMiddlewares,
 upload.single("avatar"),
 upLoadImg,
 controller.changeAvatarPatch
);

module.exports = route;