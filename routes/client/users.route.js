const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/users.controller.js");

router.get("/not-friend", controller.notFriend);


router.get("/request", controller.request);

module.exports = router;