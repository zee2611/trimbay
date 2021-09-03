const Category = require("../model/category.model");
const Joi = require("joi");
const _ = require("lodash");
const slugify = require("slugify");

const categoryValidation = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  banner: Joi.string().required(),
});

exports.createCategory = async (req, res) => {
  const { error } = categoryValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const categoryExists = await Category.findOne({ name: req.body.name });
  if (categoryExists)
    return res
      .status(400)
      .json({ error: `category with name ${req.body.name} already exists` });

  const category = new Category({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: req.body.image,
    banner: req.body.banner,
  });

  await category
    .save()
    .then((myData) => {
      res.status(200).json({ category, message: "New category created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create category" });
    });
};

exports.getSingleCategory = async (req, res) => {
  const name = req.params.name;

  try {
    await Category.findOne({ name: name }, (err, category) => {
      if (err || !category)
        return res.status(400).json({ err, error: "Category not found" });

      res.status(200).json({ category });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    await Category.find({}, (err, category) => {
      if (err || !category)
        return res.status(400).json({ err, error: "Category not found" });

      res.status(200).json({ category });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.updateCategory = async (req, res) => {
  const { categoryData } = req.body;
  const name = req.params.name;

  await Category.findOne({ name: name }, (err, category) => {
    if (err || !category) {
      return res.status(400).json({ err, message: "category doesnt found" });
    } else {
      category.name = categoryData.name;
      category.slug = slugify(categoryData.name);
      category.image = categoryData.image;
      category.banner = categoryData.banner;

      category
        .save()
        .then((myData) => {
          res
            .status(200)
            .json({ category, message: "Category updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update" });
        });
    }
  });
};

exports.deleteCategory = async (req, res) => {
  try {
    const name = req.params.name;

    await Category.findOneAndDelete({ name: name }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete category" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
