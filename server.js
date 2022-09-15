const http = require("http");
const path = require("path");
const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const MongoDB_URI =
    "mongodb+srv://Adebobola:Remmys2206@atlascluster.qbcmaay.mongodb.net/?retryWrites=true&w=majority";

const store = new MongoDbStore({
    uri: MongoDB_URI,
    collection: "sessions",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const errorcontroller = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "my session",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
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
    .connect(MongoDB_URI)
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

// app.listen(3000);
