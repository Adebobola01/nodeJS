const http = require("http");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorcontroller = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then((user) => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    next();
});
// app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorcontroller.notFound);

mongoConnect(() => {
    app.listen(3000);
});

// app.listen(3000);
