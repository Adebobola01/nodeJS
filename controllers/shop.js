const Cart = require("../models/cart");
const Product = require("../models/Products");

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.ProductId;
    Product.findByPk(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                pageTitle: "Details",
                path: "/products",
                product: product,
            });
        })
        .catch((err) => console.log(err));
    // Product.findById(prodId)
    //     .then((product) => {
    //         res.render("shop/product-detail", {
    //             pageTitle: "Details",
    //             path: "/products",
    //             product: product,
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    // res.redirect("/");
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    (prod) => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty,
                    });
                }
            }
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: cartProducts,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.getById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.getById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart");
    });
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
