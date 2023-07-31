const { findExample } = require("../models/example-model");

exports.getExample = (req, res, next) => {
  findExample()
    .then((data) => {
      res.status(200).send({ testData: data });
    })
    .catch((err) => {
      return next(err);
    });
};

