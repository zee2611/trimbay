const Coupon = require("../model/coupon.model");
const Joi = require("joi");

const couponValidation = Joi.object({
  name: Joi.string().required(),
  percentage: Joi.number().required(),
  expiry: Joi.date().required(),
  totalPrice: Joi.number().required(),
});

exports.createCoupon = async (req, res) => {
  const { error } = couponValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const couponExists = await Coupon.findOne({ name: req.body.name });
  if (couponExists)
    return res
      .status(400)
      .json({ error: `Coupon code with name ${req.body.name} already exists` });

  const coupon = new Coupon({
    name: req.body.name,
    percentage: req.body.percentage,
    expiry: req.body.expiry,
    totalPrice: req.body.totalPrice,
  });

  await coupon
    .save()
    .then((coupon) => {
      res.status(200).json({ coupon, message: "New Coupon code created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create Coupon code" });
    });
};

exports.getSinleCoupon = async (req, res) => {
  const name = req.params.name;

  try {
    await Coupon.findOne({ name: name }, (err, coupon) => {
      if (err || !coupon)
        return res.status(400).json({ err, error: "Coupon code not found" });

      res.status(200).json({ coupon });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCoupon = async (req, res) => {
  try {
    await Coupon.find({}, (err, coupon) => {
      if (err || !coupon)
        return res.status(400).json({ err, error: "Coupon codes not found" });

      res.status(200).json({ coupon });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.updateCoupon = async (req, res) => {
  const { couponData } = req.body;
  const name = req.params.name;

  await Coupon.findOne({ name: name }, (err, coupon) => {
    if (err || !coupon) {
      return res.status(400).json({ err, message: "Coupon code doesnt found" });
    } else {
      coupon.name = couponData.name;
      coupon.percentage = couponData.percentage;
      coupon.expiry = couponData.expiry;
      coupon.totalPrice = couponData.totalPrice;

      coupon
        .save()
        .then((coupon) => {
          res
            .status(200)
            .json({ coupon, message: "coupon code updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update coupon code" });
        });
    }
  });
};

exports.deleteCoupon = async (req, res) => {
  try {
    const name = req.params.name;

    await Coupon.deleteOne({ name: name }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete Coupon code" });
      }

      res.status(200).json({ message: "Coupon code deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};

exports.deleteMultipleCoupon = async (req, res, next) => {
  try {
    const name = req.body.name;

    await Coupon.deleteMany({ name: name }, (err, data) => {
      if (err || !data) {
        return res.status(400).json({ err, error: "can't delete Coupon code" });
      }

      if (data) {
        res.status(200).json({ message: "Coupon code deleted successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
