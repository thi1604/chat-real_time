const express = require("express");
const route = express.Router();
const controller = require("../../controller/client/chat.controller.js");
const isAccessMiddlewares = require("../../middlewares/client/isAccess.middlewares");
const upLoadImg = require("../../helper/changeAvatarGroup.helpler");
const multer  = require('multer'); // Day anh len nodejs
const upload = multer();
const superAdminMiddlewares = require("../../middlewares/client/isSuperAdmin.middlewares");

route.get("/:id", isAccessMiddlewares, controller.chat);

route.use("/:id", isAccessMiddlewares, superAdminMiddlewares);

route.get("/:id/change-title", controller.changeTitle);

route.patch("/:id/change-title", controller.changeTitlePatch);

route.get("/:id/change-name-user", controller.changeName);

route.patch("/:id/change-name-user/:idUser", controller.changeNamePatch);

route.get("/:id/change-avatar", controller.changeAvatar);

route.patch("/:id/change-avatar",
 upload.single("avatar"),
 upLoadImg,
 controller.changeAvatarPatch
);

route.get("/:id/member", controller.member);

route.get("/:id/add-member", controller.addMember);

route.patch("/:id/add-member", controller.addMemberPatch);

route.get("/:id/update-role-member", controller.updateRoleMember);

route.patch("/:id/update-role-member", controller.updateRoleMemberPatch);

module.exports = route;