const http = require("http");
const path = require("path");
const sequelize = require("./util/database");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const errorcontroller = require("./controllers/error");
const Product = require("./models/Product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});
app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorcontroller.notFound);

Product.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE",
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    .sync()
    // .sync({ force: true })
    .then((result) => {
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            return User.create({
                name: "Bobola",
                email: "bobolatest@testmail.com",
            });
        }
        return user;
    })
    .then((user) => {
        return user.createCart();
    })
    .then((cart) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

// app.listen(3000);
