const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../modifiers/is-auth");
const { check, body } = require("express-validator");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
    "/add-product",
    [
        body("title").trim().isString().isLength({ min: 3 }),
        body("imageUrl", "image url should be a valid url").trim().isURL(),
        body("price", "price should be a valid float").trim().isFloat(),
        body(
            "description",
            "description should be string and not greater than 400 letters"
        )
            .trim()
            .isLength({ min: 5, max: 400 }),
    ],
    isAuth,
    adminController.postAddProduct
);
router.get("/products", isAuth, adminController.getAdminProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product/", isAuth, adminController.postEditProduct);
router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
