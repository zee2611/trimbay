const mongoose = require("mongoose");
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },

    parent: { type: mongoose.Schema.ObjectId, ref: "Category" },
  },
  { timestamps: true, collection: "subcategory" }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
