const Cart = require("../model/cart.model");
const Auth = require("../model/auth.model");

//Add Product to Cart
exports.addToCart = async (req, res) => {
  await Cart.findOne({ user: req.user._id }, (err, cart) => {
    if (err) return res.status(400).json({ err });

    if (cart) {
      const product = req.body.cartItems.product;
      const color = req.body.cartItems.color;
      const size = req.body.cartItems.size;

      const isItemAdded = cart.cartItems?.find(
        (c) => c.product == product && c.color == color && c.size == size
      );

      if (isItemAdded) {
        Cart.findOneAndUpdate(
          {
            user: req.user._id,
            "cartItems.product": product,
            "cartItems.color": color,
            "cartItems.size": size,
          },
          {
            $set: {
              "cartItems.$.quantity":
                isItemAdded.quantity + req.body.cartItems.quantity,
              "cartItems.$.price": isItemAdded.price + req.body.cartItems.price,
            },
          },
          { new: true }
        ).exec((error, cart) => {
          if (error) return res.status(400).json({ error });
          res.status(200).json({ cart });
        });
      } else {
        Cart.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              cartItems: req.body.cartItems,
            },
          },
          { new: true }
        ).exec((error, cart) => {
          if (error) return res.status(400).json({ error });
          res.status(200).json({ cart, message: "Product added to your cart" });
        });
      }
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });

      try {
        cart.save((err, result) => {
          if (err) return res.status(400).json({ err });

          res
            .status(201)
            .json({ result, message: "Product added to your cart" });
        });
      } catch (error) {
        res.status(400).json({ error });
      }
    }
  });
};

//Get User cart
exports.getUserCart = async (req, res) => {
  try {
    await Cart.findOne({ user: req.user._id }, (err, cart) => {
      if (err || !cart)
        return res.status(400).json({ err, error: "Cart not found" });

      res.status(200).json({ cart });
    });

    // .populate({
    //     path: "cartItems.product",
    //     model: "Product",
    //   });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Remove item from a cart
exports.removeItemFromCart = async (req, res) => {
  const cartItemId = req.params.id;

  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: cartItemId } } },
      { new: true }
    ).exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      res.status(200).json({ cart });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

//Move to wishlist
exports.moveToWishlist = async (req, res) => {
  const { productId, cartItemId } = req.body;

  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: cartItemId } } },
      { new: true }
    ).exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        Auth.findOne({ _id: req.user._id }, (err, user) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ err, message: "user profile doesnt found" });
          }

          const isProductAdded = user.wishlist?.find(
            (wish) => wish == productId
          );

          if (isProductAdded) {
            return res.status(400).json({
              error: "You already hav this product in your cart",
            });
          }

          user.wishlist.push(productId);

          user
            .save()
            .then((myData) => {
              res.status(200).json({ message: "whishlist added" });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({ error: "unable to add whishlist" });
            });
        }).select("-password");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};
