const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      text: true,
    },
    slug: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    category: { type: mongoose.Schema.ObjectId, ref: "Category" },

    subCategory: { type: mongoose.Schema.ObjectId, ref: "Subcategory" },

    brand: { type: mongoose.Schema.ObjectId, ref: "Brand" },

    theme: { type: mongoose.Schema.ObjectId, ref: "Theme" },

    sold: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    stockStatus: {
      type: String,
      default: "instock",
    },

    price: {
      type: Number,
      required: true,
    },
    size: {
      type: Array,
      required: true,
    },
    variations: [
      {
        color: {
          type: String,
          required: true,
        },
        size: [
          {
            name: {
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
        images: {
          type: Array,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, collection: "product" }
);

module.exports = mongoose.model("Product", productSchema);
