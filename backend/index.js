const express = require("express");
const dotenv = require("dotenv");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const cors = require("cors");
const user = require("./users");
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());

// check verify token
app.post("/api/posts", verifyToken, (req, res) => {
  jsonwebtoken.verify(req.token, JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

// create json token of {user} and expires in 30 minutes
app.get("/", (req, res) => {
  jsonwebtoken.sign(
    { user },
    JWT_SECRET,
    { expiresIn: "30m" },
    (err, token) => {
      res.json({
        token,
      });
    }
  );
});

//logout
app.post("/logout", verifyToken, (req, res) => {
  jsonwebtoken.verify(req.token, JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      req.token = "";
      res.json({
        message: "user Logout...",
      });
    }
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
app.listen(PORT, () => {
  console.log("server is running on PORT ", PORT);
});
