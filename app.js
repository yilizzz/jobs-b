const express = require("express");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

mongoose
  .connect(
    process.env.DATABASE_URL ||
      "mongodb+srv://yilizhang3:hlrvqrUf4zfXNj1f@cluster0.7mfkjee.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connect to MongoDB jobs successful !"))
  .catch(() => console.log("Connect to MongoDB jobs failed !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
