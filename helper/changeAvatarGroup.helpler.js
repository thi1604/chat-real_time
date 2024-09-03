const streamUpLoad = require("../helper/streamUpload");

module.exports = async (req, res, next) => {
  const result = await streamUpLoad(req.file.buffer);
  req.urlCloud = result.url;
  next();
};


