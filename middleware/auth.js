var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    var token = req.headers.authorization.split(" ")[1];

    var decode = jwt.verify(token, "seceret");
    req.userData = decode;
    console.log("token", decode);
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid Token",
    });
  }
};
