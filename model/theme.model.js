const mongoose = require("mongoose");
const themeSchema = new mongoose.Schema(
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
    banner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "theme" }
);

module.exports = mongoose.model("Theme", themeSchema);
