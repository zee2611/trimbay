const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const categoryRouter = require("./routes/category.routes");
const subRouter = require("./routes/subCategory.routes");
const productRouter = require("./routes/product.routes");
const s3Router = require("./routes/s3.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");
const feedbackRouter = require("./routes/feedback.routes");
const brandRouter = require("./routes/brand.routes");
const themeRouter = require("./routes/theme.routes");
const bannerRouter = require("./routes/banner.routes");
const couponRouter = require("./routes/coupon.outes");

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(
    (res) => {
      console.log("mongodb connected");
    },
    (err) => {
      console.log(err);
    }
  );

app.get("/", (req, res) => {
  res.send("Express server works");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subRouter);
app.use("/product", productRouter);
app.use("/s3", s3Router);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/feedback", feedbackRouter);
app.use("/brand", brandRouter);
app.use("/theme", themeRouter);
app.use("/banner", bannerRouter);
app.use("/coupon", couponRouter);

app.listen(PORT, () => {
  console.log("listening on port 5000");
});
