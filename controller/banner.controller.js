const Banner = require("../model/banner.model");
const Joi = require("joi");

exports.createBanner = async (req, res) => {
  const banner = new Banner({
    image: req.body.image,
    text: req.body.text,
    category: req.body.category,
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    theme: req.body.theme,
  });

  await banner
    .save()
    .then((banner) => {
      res.status(200).json({ banner, message: "New Banner created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create Banner" });
    });
};

exports.getSingleBanner = async (req, res) => {
  const _id = req.params.id;

  try {
    await Banner.findOne({ _id: _id }, (err, banner) => {
      if (err || !banner)
        return res.status(400).json({ err, error: "Banner not found" });

      res.status(200).json({ banner });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBanner = async (req, res) => {
  try {
    await Banner.find({}, (err, banner) => {
      if (err || !banner)
        return res.status(400).json({ err, error: "Banners not found" });

      res.status(200).json({ banner });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.updateBanner = async (req, res) => {
  const { bannerData } = req.body;
  const _id = req.params.id;

  await Banner.findOne({ _id: _id }, (err, banner) => {
    if (err || !banner) {
      return res.status(400).json({ err, message: "Banner doesnt found" });
    } else {
      banner.image = bannerData.image;
      banner.text = bannerData.text;
      banner.category = bannerData.category;
      banner.subCategory = bannerData.subCategory;
      banner.brand = bannerData.brand;
      banner.theme = bannerData.theme;

      banner
        .save()
        .then((banner) => {
          res
            .status(200)
            .json({ banner, message: "Banner updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update Banner" });
        });
    }
  });
};

exports.deleteBanner = async (req, res) => {
  try {
    const _id = req.params.id;

    await Banner.findOneAndDelete({ _id: _id }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete Banner" });
      }

      res.status(200).json({ message: "Banner deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
