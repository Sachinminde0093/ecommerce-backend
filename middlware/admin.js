const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { verify } = require("jsonwebtoken");

const admin = async (req, res, next) => {
  try {
    // console.log("object");
    // console.log(req.headers["auth-token"]);
    var token = req.headers["auth-token"];

    // console.log(token);

    if (!token) {
      return res.status(401).json({ msg: "user is not authenticated" });
    }

    const verify = jwt.verify(token, "passwordKey");

    if (!verify) {
      return res.status(401).json({ msg: "token is not verified" });
    }

    const user = await User.findById(verify.id);

    if (user.type == "user" || user.type == "seller") {
      return res.status(401).json({ msg: "You are not an admin!" });
    }

    req.user = verify.id;
    req.token = token;

    next();
  } catch (e) {
    res.status(500).json({ error: e.message + "error" });
  }
};

module.exports = admin;
