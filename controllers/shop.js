const Product = require("../models/Product");
const Order = require("../models/order");
const path = require("path");
const fs = require("fs");
const pdfDocument = require("pdfkit");

const NUMBER_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
    let totalProducts;
    const page = +req.query.page || 1;
    Product.find()
        .countDocuments()
        .then((numProduct) => {
            totalProducts = numProduct;
            return Product.find()
                .skip((page - 1) * NUMBER_PER_PAGE)
                .limit(NUMBER_PER_PAGE);
        })
        .then((products) => {
            console.log(products);
            res.render("shop/index", {
                prods: products,
                pageTitle: "products",
                path: "/products",
                currentPage: page,
                hasNextPage: page * NUMBER_PER_PAGE < totalProducts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalProducts / NUMBER_PER_PAGE),
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
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
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
                    email: req.user.email,
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
    req.user.deleteFromCart(prodId).then((results) => {
        res.redirect("/cart");
    });
};

exports.getIndex = (req, res, next) => {
    let totalProducts;
    const page = +req.query.page || 1;
    Product.find()
        .countDocuments()
        .then((numProduct) => {
            totalProducts = numProduct;
            return Product.find()
                .skip((page - 1) * NUMBER_PER_PAGE)
                .limit(NUMBER_PER_PAGE);
        })
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                currentPage: page,
                hasNextPage: page * NUMBER_PER_PAGE < totalProducts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalProducts / NUMBER_PER_PAGE),
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No order found!"));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unauthorized"));
            }

            const pdfDoc = new pdfDocument();
            const invoiceName = "invoice-" + orderId + ".pdf";
            const invoicePath = path.join("data", "invoice", invoiceName);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${invoiceName}"`
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text("Invoice", {
                underline: true,
            });
            pdfDoc.text("------------");
            let totalPrice = 0;
            order.products.forEach((prod) => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc.text(
                    `${prod.product.title}-- ${prod.quantity} * ${prod.product.price}`
                );
            });

            pdfDoc.text("-------");
            pdfDoc.fontSize(18).text(`Total Price: $${totalPrice}`);
            pdfDoc.end();
        })
        .catch((err) => {
            console.log("=>", err);
            throw err;
        });
};
