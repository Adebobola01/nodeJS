const http = require("http");
const path = require("path");
const db = require("./util/database");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorcontroller = require("./controllers/error");
const { deleteById } = require("./models/Products");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/admin", adminRoutes);

app.use(errorcontroller.notFound);

app.listen(3000);
