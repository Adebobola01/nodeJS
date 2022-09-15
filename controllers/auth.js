const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("63220ab63142a466d2b26e2f").then((user) => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        // req.session.user = undefined;
        console.log(err);
        res.redirect("/");
    });
};
