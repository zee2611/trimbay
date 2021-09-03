const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    text: {
      type: String,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: "",
    },

    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Subcategory",
      default: "",
    },

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      default: "",
    },

    theme: {
      type: mongoose.Schema.ObjectId,
      ref: "Theme",
      default: "",
    },
  },
  { timestamps: true, collection: "banner" }
);

module.exports = mongoose.model("Banner", bannerSchema);
