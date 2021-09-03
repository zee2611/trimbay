const mongoose = require("mongoose");
const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "customer",
    },

    resetLink: {
      data: String,
      default: "",
    },

    mobile: {
      type: Number,
    },

    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],

    order: [{ type: mongoose.Schema.ObjectId, ref: "Order" }],

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

    cardDetails: {
      cardNo: {
        type: String,
        default: "",
      },
      expiry: {
        date: {
          type: String,
          default: "",
        },
        month: {
          type: String,
          default: "",
        },
      },
    },
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("Auth", authSchema);
