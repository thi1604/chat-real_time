const userModel = require("../../models/user.model");


module.exports.infoUser = async (req, res, next) => {
  const idTokenUser = req.cookies.tokenUser;
  // console.log(idTokenUser);
  if(idTokenUser){
    const user = await userModel.findOne({
      tokenUser : idTokenUser
    });
    if(user){
      res.locals.user = user;
    }
  }
  next();
}

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser) {
    res.redirect("/user/login");
    return;
  }

  const user = await userModel.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false
  });

  if(!user) {
    res.redirect("/user/login");
    return;
  }

  next();
}