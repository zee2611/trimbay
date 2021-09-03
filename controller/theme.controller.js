const Theme = require("../model/theme.model");
const Joi = require("joi");
const _ = require("lodash");
const slugify = require("slugify");

const themeValidation = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  banner: Joi.string().required(),
});

exports.createTheme = async (req, res) => {
  const { error } = themeValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const themeExists = await Theme.findOne({ name: req.body.name });
  if (themeExists)
    return res
      .status(400)
      .json({ error: `Theme with name ${req.body.name} already exists` });

  const theme = new Theme({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: req.body.image,
    banner: req.body.banner,
  });

  await theme
    .save()
    .then((theme) => {
      res.status(200).json({ theme, message: "New Theme created" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "unable to create Theme" });
    });
};

exports.getSingleTheme = async (req, res) => {
  const name = req.params.name;

  try {
    await Theme.findOne({ name: name }, (err, theme) => {
      if (err || !theme)
        return res.status(400).json({ err, error: "Theme not found" });

      res.status(200).json({ theme });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTheme = async (req, res) => {
  try {
    await Theme.find({}, (err, theme) => {
      if (err || !theme)
        return res.status(400).json({ err, error: "Themes not found" });

      res.status(200).json({ theme });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.updateTheme = async (req, res) => {
  const { themeData } = req.body;
  const name = req.params.name;

  await Theme.findOne({ name: name }, (err, theme) => {
    if (err || !theme) {
      return res.status(400).json({ err, message: "Theme doesnt found" });
    } else {
      theme.name = themeData.name;
      theme.slug = slugify(themeData.name);
      theme.image = themeData.image;
      theme.banner = themeData.banner;

      theme
        .save()
        .then((theme) => {
          res
            .status(200)
            .json({ theme, message: "Theme updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update Theme" });
        });
    }
  });
};

exports.deleteTheme = async (req, res) => {
  try {
    const name = req.params.name;

    await Theme.findOneAndDelete({ name: name }, (err, data) => {
      if (err) {
        return res.status(400).json({ err, error: "can't delete Theme" });
      }

      res.status(200).json({ message: "Theme deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
