const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                "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",
        },
    })
);

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: null,
        oldInput: {
            email: req.body.email,
            password: req.body.password,
        },
        validationErrors: [],
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "log in",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
        });
    }

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "log in",
                errorMessage: "Invalid email or password!",
                oldInput: {
                    email: email,
                    password: password,
                },
                validationErrors: [],
            });
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
                return res.status(422).render("auth/login", {
                    path: "/login",
                    pageTitle: "log in",
                    errorMessage: "Invalid email or password!",
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: [],
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            path: "/signup",
            pageTitle: "Sign UP",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }

    bcrypt
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
        oldInput: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationErrors: [],
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/login");
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

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then((user) => {
                console.log(user);
                if (!user) {
                    req.flash("error", "No account with that email found!");
                    return res.redirect("/reset");
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save().then((result) => {
                    res.redirect("/");
                    console.log(req.body.email);
                    transporter.sendMail({
                        to: req.body.email,
                        from: "adebobolaremilekun@gmail.com",
                        subject: "Reset Password",
                        html: `
                            <p>You requested to reset password</p>
                            <p>click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>
                        `,
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    }).then((user) => {
        let message = req.flash("error");
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render("auth/new-password", {
            path: "/new-password",
            pageTitle: "New Password",
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token,
        });
    });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then((result) => {
            res.redirect("/login");
        })
        .catch((err) => {
            console.log(err);
        });
};
