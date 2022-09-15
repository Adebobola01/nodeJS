const http = require("http");
const path = require("path");
const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const errorcontroller = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("63220ab63142a466d2b26e2f")
        .then((user) => {
            req.user = user;
            console.log("connected user", req.user);
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorcontroller.notFound);

mongoose
    .connect(
        "mongodb+srv://Adebobola:Remmys2206@atlascluster.qbcmaay.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((result) => {
        User.findOne()
            .then((user) => {
                if (!user) {
                    const user = new User({
                        name: "Adebobola",
                        email: "adebobola@test.com",
                        cart: { items: [] },
                    });
                    user.save();
                }
            })
            .catch((err) => {
                console.log(err);
            });

        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

// app.listen(3000);
