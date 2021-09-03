const Product = require("../model/product.model");
const Joi = require("joi");
const _ = require("lodash");
const slugify = require("slugify");

const productValidation = Joi.object({});

exports.createProduct = async (req, res) => {
  const product = new Product({
    title: req.body.title,
    slug: slugify(req.body.title),
    description: req.body.description,
    shortDescription: req.body.shortDescription,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    price: req.body.price,
    theme: req.body.theme,
    size: req.body.size,
    variations: req.body.variations,
  });

  await product
    .save()
    .then((product) => {
      res.status(200).json({ product, message: "New product created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create product" });
    });
};

exports.getSingleProduct = async (req, res) => {
  const _id = req.params.id;

  try {
    await Product.findOne({ _id: _id }, (err, Product) => {
      if (err || !Product)
        return res.status(400).json({ err, error: "Product not found" });

      res.status(200).json({ Product });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    await Product.find({}, (err, product) => {
      if (err || !product)
        return res.status(400).json({ error: "product not found" });

      res.status(200).json({ product });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const _id = req.params.id;

    await Product.findByIdAndRemove({ _id }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete product" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};

exports.createProductReview = async (req, res) => {
  const _id = req.params.id;

  const product = await Product.findById({ _id });

  if (product) {
    // const alreadyReviewed = Product.reviews.find(
    //   (r) => r.user.toString() === req.user._id.toString()
    // );

    // if (alreadyReviewed)
    //   return res
    //     .status(400)
    //     .json({ messgage: "you already reviewed this product" });

    const review = {
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product
      .save()
      .then((product) => {
        res
          .status(200)
          .json({ product, message: "New product review created" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to create review" });
      });
  } else {
    return res.status(400).json({ error: "Product not Found" });
  }
};

exports.newArrival = async (req, res) => {
  const { createdAt, order, limit } = req.body;

  try {
    await Product.find({}, (err, newArrival) => {
      if (err || !newArrival)
        return res.status(400).json({ error: "newArrival not found" });

      res.status(200).json({ newArrival });
    })
      .populate("category")
      .populate("subCategory")
      .sort([[createdAt, order]])
      .limit(limit)
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.bestSeller = async (req, res) => {
  const { sold, order, limit } = req.body;

  try {
    await Product.find({}, (err, bestSeller) => {
      if (err || !bestSeller)
        return res.status(400).json({ error: "bestSeller not found" });

      res.status(200).json({ bestSeller });
    })
      .populate("category")
      .populate("subCategory")
      .sort([[sold, order]])
      .limit(limit)
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getProductsBasedCategory = async (req, res) => {
  const _id = req.params.id;
  const { page } = req.body;

  const currentPage = page || 1;
  const perPage = 2;

  try {
    await Product.find({ category: _id }, (err, product) => {
      if (err || !product)
        return res.status(400).json({ error: "product not found" });

      res.status(200).json({ product });
    })
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subCategory")
      .limit(perPage)
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getProductsBasedCatSubCat = async (req, res) => {
  const { category, subCategory, page } = req.body;

  const currentPage = page || 1;
  const perPage = 2;

  try {
    await Product.find(
      { category: category, subCategory: subCategory, color: "red" },
      (err, products) => {
        if (err || !products)
          return res.status(400).json({ error: "products not found" });

        res.status(200).json({ products });
      }
    )
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subCategory")
      .limit(perPage)
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getProductsByFilter = async (req, res, next) => {
  let query = {};
  let sort = "";
  let order = "";
  const productCategory = req.body.category;
  const productSubCategory = req.body.subCategory;
  const productPrice = req.body.price;
  const productRating = req.body.rating;
  const productThemes = req.body.themes;
  const productColor = req.body.color;
  const productSize = req.body.size;
  const productSort = req.body.sort;
  const productOrder = req.body.order;

  let payload = {
    category: productCategory,
    subCategory: productSubCategory,
    price: productPrice,
    rating: productRating,
    themes: productThemes,
    color: productColor,
    size: productSize,
    sort: productSort,
    order: productOrder,
  };

  if (payload.category && payload.category.length > 0)
    query.category = payload.category;

  if (payload.subCategory && payload.subCategory.length > 0)
    query.subCategory = payload.subCategory;

  if (payload.price && payload.price.length > 0)
    query.price = { $gte: payload.price[0], $lte: payload.price[1] };

  if (payload.rating && payload.rating.length > 0)
    query.rating = { $gte: payload.rating[0], $lte: payload.rating[1] };

  if (payload.themes && payload.themes.length > 0)
    query.themes = { $in: payload.themes };

  if (payload.color && payload.color.length > 0)
    query.variations = { $elemMatch: { color: { $in: payload.color } } };

  if (payload.size && payload.size.length > 0)
    query.size = { $elemMatch: { name: { $in: payload.size } } };

  if (payload.sort && payload.sort.length > 0) {
    sort = payload.sort;
  } else {
    sort = "rating";
  }

  if (payload.order && payload.order.length > 0) {
    order = payload.order;
  } else {
    order = "desc";
  }

  console.log("query", query, sort, order);

  try {
    const products = await Product.find(query)
      .populate("category", "_id, name")
      .populate("subCategory", "_id, name")
      .sort([[sort, order]])
      .exec();

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
