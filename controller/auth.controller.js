const Auth = require("../model/auth.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "255334458330-t1u9bqra92q352v3uhaiopt6atiq7sv6.apps.googleusercontent.com"
);
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const signupValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(15).required(),
  mobile: Joi.string(),
});

const signinValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).max(15).required(),
});

//signup
exports.signup = async (req, res) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const emailExists = await Auth.findOne({ email: req.body.email });
    if (emailExists)
      return res.status(400).json({ error: "Email already exists" });

    const mobileExists = await Auth.findOne({ mobile: req.body.mobile });
    if (mobileExists)
      return res.status(400).json({ error: "Mobile Number already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const auth = new Auth({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      mobile: req.body.mobile,
    });

    const newUser = await auth.save();
    const accessToken = jwt.sign(
      { _id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const refreshToken = jwt.sign(
      { _id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "2m",
      }
    );

    const { _id, name } = newUser;

    res.status(201).json({
      success: true,
      newUser: { _id, name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

//Login with Email
exports.signin = async (req, res) => {
  const { error } = signinValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await Auth.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Invalid Credentials" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid Credentials" });

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2m",
    }
  );

  const { _id, name } = user;

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user: { _id, name },
  });
};

//login with google
exports.googleLogin = (req, res) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "255334458330-t1u9bqra92q352v3uhaiopt6atiq7sv6.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        Auth.findOne({ email: email }, (err, user) => {
          if (err) {
            res.status(400).json({ error: "something went wrong..." });
          } else {
            if (user) {
              const accessToken = jwt.sign(
                { _id: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "7d",
                }
              );

              const refreshToken = jwt.sign(
                { _id: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                {
                  expiresIn: "2m",
                }
              );
              const { _id, name } = user;

              res.status(200).json({
                accessToken,
                refreshToken,
                user: { _id, name },
              });
            } else {
              let password = email + process.env.PASSWORD_SECRET;
              let newUser = new Auth({ name, email, password });
              newUser.save((err, data) => {
                if (err)
                  return res
                    .status(400)
                    .json({ error: "something went wrong..." });

                const accessToken = jwt.sign(
                  { _id: data._id },
                  process.env.ACCESS_TOKEN_SECRET,
                  {
                    expiresIn: "7d",
                  }
                );

                const refreshToken = jwt.sign(
                  { _id: data._id },
                  process.env.REFRESH_TOKEN_SECRET,
                  {
                    expiresIn: "2m",
                  }
                );

                const { _id, name } = newUser;

                res
                  .status(200)
                  .json({ accessToken, refreshToken, user: { _id, name } });
              });
            }
          }
        });
      }
    });
};

//Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  Auth.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(400).json({ error: "Please try again" });
    }
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email doesn't exists " });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.PASSWORD_RESET_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const data = {
      from: "noreply@sksstechnologies.com",
      to: email,
      subject: "Password reset link",
      html: `<h2>Please click on the link given below to reset your password</h2>
             <a href="#">${process.env.CLIENT_URL}/forgot_password/${token}</a>`,
    };

    return Auth.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        return res
          .status(400)
          .json({ err, error: "reset password link error" });
      } else {
        transporter.sendMail(data, (err, data) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "Error sending mail" });
          } else {
            return res.status(200).json({
              message: `Email sent to ${email} plase follow instruction`,
            });
          }
        });
      }
    });
  });
};

//Reset Password
exports.resetPassword = async (req, res) => {
  const { resetLink, newPassword } = req.body;

  if (resetLink) {
    jwt.verify(resetLink, process.env.PASSWORD_RESET_SECRET, (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Incorrect token Id or Token Expired" });
      }

      Auth.findOne({ resetLink }, async (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "Token with this user doesn't exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const obj = { password: hashedPassword };

        user = _.extend(user, obj);
        user.save((err, user) => {
          if (err) {
            return res.status(400).json({ error: "reset password error" });
          } else {
            return res
              .status(200)
              .json({ error: "Your password has been changed" });
          }
        });
      });
    });
  } else {
    return res.status(400).json({ error: "Authentication Error" });
  }
};

//Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Auth.findOne({ _id: req.user._id });
  if (!user) return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid Credentials" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    user
      .save()
      .then((myData) => {
        res.status(200).json({ message: "Your Password has been changed" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to update" });
      });
  }
};

//Login with mobile
exports.mobileLogin = async (req, res) => {
  res.send("mobile login");
};
