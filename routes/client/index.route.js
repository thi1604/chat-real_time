const userRouter = require("../../routes/client/user.route");
const homeRouter = require("./home.route");
const chatRouter = require("./chat.route");
const userMiddleware = require("../../middlewares/client/user-middleware");

module.exports.index = (app) => {
  app.use(userMiddleware.infoUser);
  app.use("/", homeRouter);
  app.use(
    "/users", 
    userMiddleware.requireAuth,
    userRouter
  );
  app.use(
    "/chat", 
    userMiddleware.requireAuth, 
    chatRouter
  );
};


