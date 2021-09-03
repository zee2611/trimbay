const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderItems: [
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
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: [
      {
        firstName: {
          type: String,
          default: "",
        },
        lastName: {
          type: String,
          default: "",
        },
        mobileNumber: {
          type: String,
          default: "",
        },
        address: {
          type: String,
          default: "",
        },
        city: {
          type: String,
          default: "",
        },
        state: {
          type: String,
          default: "",
        },
        country: {
          type: String,
          default: "",
        },
        landmark: {
          type: String,
          default: "",
        },
        zipcode: {
          type: String,
          default: "",
        },
      },
    ],
    taxPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {},
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: "String",
      default: "Processing",
      enum: ["Processing", "Dispatched", "Delivered", "Cancelled"],
    },
    orderStatusAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: "order" }
);

module.exports = mongoose.model("Order", orderSchema);
