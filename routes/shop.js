const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();

const productController = require("../controllers/products");

router.get("/", productController.getProducts);

module.exports = router;
