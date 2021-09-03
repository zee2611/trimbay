const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, collection: "cart" }
);

module.exports = mongoose.model("Cart", cartSchema);
