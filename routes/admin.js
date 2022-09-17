const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../modifiers/is-auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);
router.get("/products", isAuth, adminController.getAdminProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product/", isAuth, adminController.postEditProduct);
router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
