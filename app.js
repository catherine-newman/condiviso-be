const express = require("express");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ status: 404, msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
  console.log(err);
});

module.exports = app;
