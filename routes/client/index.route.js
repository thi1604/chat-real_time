const userRouter = require("../../routes/client/user.route");
const usersRouter = require("../../routes/client/users.route");
const homeRouter = require("./home.route");
const chatRouter = require("./chat.route");
const userMiddleware = require("../../middlewares/client/user-middleware");

const roomsChatRouter = require("../../routes/client/rooms-chat.route");
module.exports.index = (app) => {
  app.use(userMiddleware.infoUser);
  app.use("/", homeRouter);
  app.use(
    "/user", userRouter
  );
  app.use(
    "/users", 
    userMiddleware.requireAuth,
    usersRouter
  )
  app.use(
    "/chat", 
    userMiddleware.requireAuth,
    chatRouter
  );
  app.use(
    "/rooms-chat", 
    userMiddleware.requireAuth,
    roomsChatRouter
  );
};



