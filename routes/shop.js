const express = require("express");
const router = express.Router();
const isAuth = require("../modifiers/is-auth");

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/products/:ProductId", isAuth, shopController.getProduct);
router.post("/cart-delete-item", isAuth, shopController.postDeleteCartProduct);
router.post("/create-order", isAuth, shopController.postOrder);

module.exports = router;
