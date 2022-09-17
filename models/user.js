// const mongodb = require("mongodb");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updateCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updateCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }

    const updatedCart = {
        items: updateCartItems,
    };

    this.cart = updatedCart;

    return this.save();
};

userSchema.methods.deleteFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() === productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const ObjectId = mongodb.ObjectId();

// class User {
//     constructor(username, email, cart, _id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = _id;
//     }

//     save() {
//         const db = getDb();
//         return db
//             .collection("Users")
//             .insertOne(this)
//             .then((result) => {
//                 console.log(result);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex((cp) => {
//             return cp._id.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         const updateCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updateCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updateCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity,
//             });
//         }

//         const updatedCart = {
//             items: updateCartItems,
//         };

//         // const updatedCart = { items: [{ ...product, quantity: 1 }] };

//         const db = getDb();
//         return db
//             .collection("Users")
//             .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map((i) => {
//             return i.productId;
//         });
//         return db
//             .collection("Products")
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 console.log(productIds);
//                 return products.map((p) => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find((i) => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity,
//                     };
//                 });
//             });
//     }

//     deleteCartItem(productId) {
//         const updatedCartItems = this.cart.items.filter((item) => {
//             return item.productId.toString() === productId.toString();
//         });
//         const db = getDb();
//         db.collection("Users").updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: updatedCartItems } } }
//         );
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         username: this.username,
//                     },
//                 };
//                 db.collection("Orders").insertOne(order);
//             })
//             .then((result) => {
//                 this.cart = { item: [] };
//                 return db
//                     .collection("Users")
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     );
//             });
//     }

//     getOrder() {
//         const db = getDb();
//         return db
//             .collection("Orders")
//             .find({ "user._id": new ObjectId(this._id) })
//             .toArray();
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection("Users")
//             .findOne({ _id: new mongodb.ObjectId(userId) })
//             .then((user) => {
//                 console.log(user);
//                 return user;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = User;
