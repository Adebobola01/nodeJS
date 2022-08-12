const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);

module.exports = router;
