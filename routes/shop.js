const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.get("/orders", shopController.getOrders);
router.get("/products/:ProductId", shopController.getProduct);
router.post("/cart-delete-item", shopController.postDeleteCartProduct);
router.post("/create-order", shopController.postOrder);

module.exports = router;
