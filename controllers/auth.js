const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                "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",
        },
    })
);

exports.getLogin = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            req.flash("error", "Invalid email or password!");
            return res.redirect("/login");
        }
        bcrypt
            .compare(password, user.password)
            .then((match) => {
                if (match) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect("/");
                    });
                }
                req.flash("error", "Invalid email or password!");

                res.redirect("/login");
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash(
                    "error",
                    "email already exists, please choose another one"
                );
                return res.redirect("/signup");
            }
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                    transporter.sendMail({
                        to: email,
                        from: "adebobolaremilekun@gmail.com",
                        subject: "sign up success",
                        html: "<h1>Your sign up was successful!</h1>",
                    });
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Sign UP",
        errorMessage: message,
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        // req.session.user = undefined;
        console.log(err);
        res.redirect("/");
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        errorMessage: message,
    });
};
