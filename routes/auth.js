const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const auth = require("../middlware/auth");
const { Product } = require("../models/product");

authRouter.get("auth/get", (req, res) => {
  res.json("dfghjkl;");
});

// SIGN UP
authRouter.post("/api/signup", async (req, res) => {
  try {
    // console.log("sign up api");
    const { name, email, password } = req.body;

     // console.log(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    // console.log(e);
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
     // console.log("sign in upi");
    const { email, password } = req.body;

     // console.log(email, password);

    const user = await User.findOne({ email });


    if (!user) {
       // console.log("Invalid email address");

      res.status(400).json("Invalid email address");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    // console.log(isMatch);

    if (!isMatch) {
       // console.log("Password is not matched");
      return res.status(502).json("Password is not matched");
    }

    let data = {
      id: user._id,
      time: Date(),
    };

    const token = jwt.sign(data, "passwordKey");
// console.log(token);
    res.json({ token, ...user._doc });
  } catch (e) {
  // console.log(e);
    res.status(500).json(e.message + "error");
  }
});

authRouter.post("/tokenisvalid", async (req, res) => {
  try {
    // console.log("Token is valid");
     // console.log(JSON.stringify(req.headers));

    var token = req.headers["auth-token"];

    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, "passwordKey");

    if (!verified) return res.json(false);

    const user = User.findById(verified.id);

    if (!user) return res.json(false);

    // console.log("token verrified succesfuly");
    res.json(true);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

authRouter.get("/",auth, async (req, res) => {
  // console.log("get User");

  var user = await User.findById(req.user);

  // console.log("Data get succesfully");
  res.send({ ...user._doc, token: req.token });
});

module.exports = authRouter;
