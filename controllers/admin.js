const Product = require("../models/Products");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        prod: {},
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
    })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    // Product.getById(prodId, (product) => {
    //     res.render("admin/edit-product", {
    //         pageTitle: "Add Product",
    //         path: "/admin/edit-product",
    //         formsCSS: true,
    //         productCSS: true,
    //         activeAddProduct: true,
    //         editing: editMode,
    //         prod: product,
    //     });
    // });
    Product.findByPk(prodId)
        .then((product) => {
            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/edit-product",
                formsCSS: true,
                productCSS: true,
                activeAddProduct: true,
                editing: editMode,
                prod: product,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    Product.findByPk(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDesc;
            return product.save();
        })
        .then((result) => {
            console.log("updated");
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect("/admin/products");
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products");
};

exports.getAdminProducts = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     res.render("admin/products", {
    //         prods: products,
    //         pageTitle: "Shop",
    //         path: "/admin/products",
    //     });
    // });

    Product.findAll()
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Shop",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
