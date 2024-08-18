const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/user.controller.js");


router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/not-friend", controller.notFriend);

module.exports = router;