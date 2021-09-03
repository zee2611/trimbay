const Auth = require("../model/auth.model");

//Get single user
exports.singleUser = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await Auth.findOne({ _id: _id }).select("-password");

    if (!user) return res.status(400).json({ error: "User dosnt exist" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Get loogedin user profile
exports.userProfile = async (req, res) => {
  try {
    const user = await Auth.findOne({ _id: req.user._id }).select("-password");

    if (!user) return res.status(400).json({ error: "User dosnt exist" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Get all users
exports.allUsers = async (req, res) => {
  try {
    await Auth.find({}, (err, users) => {
      if (err || !users) {
        return res.status(400).json({ error: "Cant find users" });
      } else {
        res.status(200).json({ users });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Update user card details
exports.updateCardDetails = async (req, res) => {
  const { cardNo, date, month } = req.body;

  await Auth.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        "cardDetails.cardNo": cardNo,
        "cardDetails.expiry.date": date,
        "cardDetails.expiry.month": month,
      },
    },
    { new: true }
  )
    .select("-password")
    .exec((error, user) => {
      if (error) return res.status(400).json({ error });
      res.status(200).json({ user });
    });
};

//Delete particular user
exports.deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;

    await Auth.findByIdAndRemove({ _id }, (err, res) => {
      if (err || !res) {
        return res.status(400).json({ err });
      }

      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};

//Update user Profile
exports.updateUserProfile = async (req, res) => {
  try {
    Auth.findById({ _id: req.user._id }, (err, user) => {
      if (!user) {
        res.status(400).json({ error: "User Not Found" });
      } else {
        user.name = req.body.name;
        user.mobile = req.body.mobile;

        user
          .save()
          .then((myData) => {
            res.status(200).json({ user, message: "Profile Updated" });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "unable to update" });
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};

//Add user Shipping Address
exports.AddShippingAddress = async (req, res) => {
  const { shippingAddress } = req.body;

  await Auth.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err, message: "user doesnt found" });
    }

    if (user.shippingAddress.length < 2) {
      user.shippingAddress.push(shippingAddress);

      user
        .save()
        .then((myData) => {
          res.status(200).json({ user, message: "Address added successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update" });
        });
    } else {
      return res.status(400).json({ error: "Already hav max no of address" });
    }
  });
};

//remove address
exports.removeAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    await Auth.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { shippingAddress: { _id: addressId } } },
      { new: true }
    )
      .select("-password")
      .exec((error, user) => {
        if (error) return res.status(400).json({ error });
        res.status(200).json({ user });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

//Edit address
exports.editAddress = async (req, res) => {
  const addressId = req.params.id;
  const { shippingAddress } = req.body;
  try {
    await Auth.findOne({ _id: req.user._id }, (err, user) => {
      if (user.shippingAddress.length == 0) {
        return res
          .status(400)
          .json({ err, message: "user doesnt hav address" });
      } else {
        const objIndex = user.shippingAddress.findIndex(
          (obj) => obj._id == addressId
        );

        if (objIndex < 0) {
          return res
            .status(400)
            .json({ err, message: "cant find your address" });
        }

        user.shippingAddress[objIndex].firstName = shippingAddress.firstName;
        user.shippingAddress[objIndex].lastName = shippingAddress.lastName;
        user.shippingAddress[objIndex].mobileNumber =
          shippingAddress.mobileNumber;
        user.shippingAddress[objIndex].address = shippingAddress.address;
        user.shippingAddress[objIndex].city = shippingAddress.city;
        user.shippingAddress[objIndex].state = shippingAddress.state;
        user.shippingAddress[objIndex].country = shippingAddress.country;
        user.shippingAddress[objIndex].landmark = shippingAddress.landmark;
        user.shippingAddress[objIndex].zipcode = shippingAddress.zipcode;

        user
          .save()
          .then((myData) => {
            res.status(200).json({ user, message: "Profile Updated" });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "unable to update" });
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

//Add whishlist
exports.wishlist = async (req, res) => {
  const productId = req.params.productId;

  await Auth.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err, message: "user doesnt found" });
    }

    const isProductAdded = user.wishlist?.find((wish) => wish == productId);

    if (isProductAdded) {
      return res
        .status(400)
        .json({ err, error: "You already hav this product in your cart" });
    }

    user.wishlist.push(productId);

    user
      .save()
      .then((myData) => {
        res.status(200).json({ user, message: "whishlist added" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to add whishlist" });
      });
  }).select("-password");
};

//Add whishlist
exports.Removewishlist = async (req, res) => {
  const productId = req.params.productId;

  await Auth.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err, message: "user doesnt found" });
    }

    user.wishlist.pull(productId);

    user
      .save()
      .then((myData) => {
        res.status(200).json({ user, message: "whishlist removed" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to remove whishlist" });
      });
  });
};

//change user verified profile
exports.changeUserVerified = async (req, res) => {
  try {
    Auth.findById({ _id: req.user._id }, (err, user) => {
      if (!user) {
        res.status(400).json({ error: "User Not Found" });
      } else {
        user.verified = true;

        user
          .save()
          .then((myData) => {
            res.status(200).json({ user, message: "Profile Updated" });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "unable to update" });
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err });
  }
};
