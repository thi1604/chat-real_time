const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/rooms-chat.controller.js");


router.get("", controller.index);

router.get("/create", controller.creat);

router.post("/create", controller.creatPost);

module.exports = router;