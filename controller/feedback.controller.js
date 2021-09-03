const Feedback = require("../model/feedback.model");

exports.addfeedback = async (req, res) => {
  try {
    const feedback = new Feedback({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await feedback
      .save()
      .then((feedback) => {
        res
          .status(200)
          .json({ feedback, message: "Your feedback has been placed" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to place your feedback" });
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "unable to place your feedback" });
  }
};
