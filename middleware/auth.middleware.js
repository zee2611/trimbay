const jwt = require("jsonwebtoken");
const Auth = require("../model/auth.model");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ error: "Please Login to access" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).send({ error: "Invalid Token" });

    req.user = user;
    next();
  });
};

exports.userRole = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ error: "not authorized as admin" });
  }
};
