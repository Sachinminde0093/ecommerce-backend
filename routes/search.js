const express = require("express");
const auth = require("../middlware/auth");
const {Product} = require("../models/product");

const searchRouter = express.Router();

searchRouter.get("/api/search/:name", auth, async (req, res) => {
  try {
    // console.log(req.params.name);
    var product = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = searchRouter;
