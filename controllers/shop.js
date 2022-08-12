const Product = require("../models/Products");

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "Shop",
            path: "products",
        });
        console.log(products);
    });
};
exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
        pageTitle: "Cart",
        path: "cart",
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        });
    });
};
