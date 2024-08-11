module.exports.generateRandomString = (length)=>{
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  let n = characters.length;
  for(let i = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * n));
  }
  return result;
}

module.exports.generateRandomNumber = (length)=>{
  const characters = "0123456789";

  let result = "";
  let n = characters.length;
  for(let i = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * n));
  }
  return result;
}