const Subcategory = require("../model/subCategory.model");
const Joi = require("joi");
const _ = require("lodash");
const slugify = require("slugify");

const subcategoryValidation = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  parent: Joi.string().required(),
});

exports.createSubcategory = async (req, res) => {
  const { error } = subcategoryValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const subcategory = new Subcategory({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: req.body.image,
    parent: req.body.parent,
  });

  await subcategory
    .save()
    .then((myData) => {
      res.status(200).json({ subcategory, message: "New subcategory created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create subcategory" });
    });
};

exports.getSingleSubCategory = async (req, res) => {
  const _id = req.params.id;

  try {
    await Subcategory.findOne({ _id: _id }, (err, subcategory) => {
      if (err || !subcategory)
        return res.status(400).json({ err, error: "subcategory not found" });

      res.status(200).json({ subcategory });
    })
      .populate("parent")
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.getAllSubCategory = async (req, res) => {
  try {
    await Subcategory.find({}, (err, subcategory) => {
      if (err || !subcategory)
        return res.status(400).json({ err, error: "subcategorys not found" });

      res.status(200).json({ subcategory });
    })
      .populate("parent")
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const _id = req.params.id;

    await Subcategory.findByIdAndDelete({ _id }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete subcategory" });
      }

      res.status(200).json({ message: "subCategory deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { subCategoryData } = req.body;
  const _id = req.params.id;

  await Subcategory.findOne({ _id: _id }, (err, subCategory) => {
    if (err || !subCategory) {
      return res.status(400).json({ err, message: "subcategory doesnt found" });
    } else {
      subCategory.name = subCategoryData.name;
      subCategory.slug = slugify(subCategoryData.name);
      subCategory.image = subCategoryData.image;
      subCategory.banner = subCategoryData.banner;

      subCategory
        .save()
        .then((myData) => {
          res
            .status(200)
            .json({ subCategory, message: "subCategory updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update" });
        });
    }
  });
};

exports.getSubcategoryBaseParent = async (req, res) => {
  const parentId = req.params.parentId;

  try {
    await Subcategory.find({ parent: parentId }, (err, subcategory) => {
      if (err || !subcategory)
        return res.status(400).json({ err, error: "subcategorys not found" });

      res.status(200).json({ subcategory });
    })
      .populate("parent")
      .exec();
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
