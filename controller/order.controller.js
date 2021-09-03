const Order = require("../model/order.model");

exports.placeOrder = async (req, res, next) => {
  try {
    const order = new Order({
      user: req.user._id,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
      paymentMethod: req.body.paymentMethod,
      isPaid: req.body.isPaid,
      paidAt: req.body.paidAt,
    });

    await order
      .save()
      .then((order) => {
        res.status(200).json({ order, message: "Your order has been placed" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: "unable to place your order" });
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: "unable to place your order" });
  }
};

exports.getMyOrder = async (req, res) => {
  try {
    const myOrder = await Order.find({ user: req.user._id });

    if (!myOrder)
      return res.status(400).json({ error: "unable to fetch your order" });
    res.status(200).json({ myOrder });
  } catch (err) {
    res.status(400).json({ err, error: "unable to fetch your order" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    await Order.find({}, (err, orders) => {
      if (err || !orders)
        return res.status(400).json({ error: "orders not found" });

      res.status(200).json({ orders });
    })
      .sort([["createdAt", "desc"]])
      .exec();
  } catch (err) {
    res.status(400).json({ err, error: "orders not found" });
  }
};

exports.getSingleOrder = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Order.findOne({ _id: id }, (err, order) => {
      if ((err, !order)) {
        res.status(400).json({ error: "No Order Found" });
      }
      res.status(200).json({ order });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const _id = req.params.id;

  await Order.findOne({ _id: _id }, (err, order) => {
    if (err || !order) {
      return res.status(400).json({ err, error: "order doesnt found" });
    } else {
      order.orderStatus = orderStatus;
      order.orderStatusAt = Date.now();

      order
        .save()
        .then((order) => {
          res
            .status(200)
            .json({ order, message: "order updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update" });
        });
    }
  });
};

exports.updateOrderToPaid = async (req, res) => {
  const { orderStatus } = req.body;
  const _id = req.params.id;

  await Order.findOne({ _id: _id }, (err, order) => {
    if (err || !order) {
      return res.status(400).json({ err, error: "order doesnt found" });
    } else {
      order.orderStatus = orderStatus;
      order.orderStatusAt = Date.now();

      order
        .save()
        .then((order) => {
          res
            .status(200)
            .json({ order, message: "order updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: "unable to update" });
        });
    }
  });
};
