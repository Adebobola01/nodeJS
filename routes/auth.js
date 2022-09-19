const { promiseImpl } = require("ejs");
const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
    "/login",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email!")
            .normalizeEmail(),
        body(
            "password",
            "password must be atleast 6 characters long, and must not contain special characters"
        )
            .trim()
            .isLength({ min: 6 })
            .isAlphanumeric(),
    ],
    authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("please enter a valid email")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject(
                            "Email is already in use by another user!"
                        );
                    }
                });
            })
            .normalizeEmail(),
        body(
            "password",
            "Password must be atleast 6 characters long, and must not contain special characters"
        )
            .trim()
            .isLength({ min: 6 })
            .isAlphanumeric(),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password have to match!");
                }
                return true;
            }),
    ],
    authController.postSignup
);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("reset:token", authController.getNewPassword);
router.post("new-password", authController.postNewPassword);

module.exports = router;
