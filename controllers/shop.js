const Product = require("../models/Product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Shop",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.ProductId;
    Product.findById(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                pageTitle: "Details",
                path: "/products",
                product: product,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        // .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then((product) => {
            console.log(req.session.user);
            return req.session.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.session.user._id })
        .then((orders) => {
            console.log("orders =>", orders.products);
            res.render("shop/orders", {
                pageTitle: "Orders",
                path: "/orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        // .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                };
            });

            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
            });
            order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.session.user.deleteFromCart(prodId).then((results) => {
        res.redirect("/cart");
    });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
