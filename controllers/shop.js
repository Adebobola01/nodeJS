const Cart = require("../models/cart");
const Product = require("../models/Product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.findById(prodId)
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
    req.user
        .getCart()
        .then((products) => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
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
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
    // let fetchedCart;
    // req.user
    //     .getCart()
    //     .then((cart) => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: prodId } });
    //     })
    //     .then((products) => {
    //         let product;
    //         let newQuantity = 1;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return fetchedCart.addProduct(product, {
    //                 through: { quantity: newQuantity },
    //             });
    //         }
    //         return Product.findByPk(prodId)
    //             .then((product) => {
    //                 fetchedCart.addProduct(product, {
    //                     through: {
    //                         quantity: newQuantity,
    //                     },
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    // res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ["products"] })
        .then((orders) => {
            res.render("shop/orders", {
                pageTitle: "Orders",
                path: "/orders",
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            return req.user
                .createOrder()
                .then((order) => {
                    return order
                        .addProducts(
                            products.map((product) => {
                                product.orderItem = {
                                    quantity: product.cartItem.quantity,
                                };
                                return product;
                            })
                        )
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
            // console.log(products);
            // res.redirect("/cart");
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
        })
        .then((result) => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId).then((results) => {
        res.redirect("/cart");
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
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
