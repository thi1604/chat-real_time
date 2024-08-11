const mongoose = require("mongoose");

module.exports.connect = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Ket noi database thanh cong!");
  }catch(error){
    console.log("Ket noi database that bai!");
  }
};