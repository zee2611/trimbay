const Brand = require("../model/brand.model");
const Joi = require("joi");
const _ = require("lodash");
const slugify = require("slugify");

const brandValidation = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  banner: Joi.string().required(),
});

exports.createBrand = async (req, res) => {
  const { error } = brandValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const brandExists = await Brand.findOne({ name: req.body.name });
  if (brandExists)
    return res
      .status(400)
      .json({ error: `Brand with name ${req.body.name} already exists` });

  const brand = new Brand({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: req.body.image,
    banner: req.body.banner,
  });

  await brand
    .save()
    .then((brand) => {
      res.status(200).json({ brand, message: "New Brand created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create Brand" });
    });
};

exports.getSingleBrand = async (req, res) => {
  const name = req.params.name;

  try {
    await Brand.findOne({ name: name }, (err, brand) => {
      if (err || !brand)
        return res.status(400).json({ err, error: "Brand not found" });

      res.status(200).json({ brand });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBrand = async (req, res) => {
  try {
    await Brand.find({}, (err, brand) => {
      if (err || !brand)
        return res.status(400).json({ err, error: "Brands not found" });

      res.status(200).json({ brand });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.updateBrand = async (req, res) => {
  const { brandData } = req.body;
  const name = req.params.name;

  await Brand.findOne({ name: name }, (err, brand) => {
    if (err || !brand) {
      return res.status(400).json({ err, message: "Brand doesnt found" });
    } else {
      brand.name = brandData.name;
      brand.slug = slugify(brandData.name);
      brand.image = brandData.image;
      brand.banner = brandData.banner;

      brand
        .save()
        .then((brand) => {
          res
            .status(200)
            .json({ brand, message: "Brand updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update Brand" });
        });
    }
  });
};

exports.deleteBrand = async (req, res) => {
  try {
    const name = req.params.name;

    await Brand.findOneAndDelete({ name: name }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete Brand" });
      }

      res.status(200).json({ message: "Brand deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
