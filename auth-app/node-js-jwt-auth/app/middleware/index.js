const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyPlaces = require("./verifyPlaces");
const verifyLot = require("./verifyLot");
const verifyPricing = require("./verifyPricing");

module.exports = {
  authJwt,
  verifySignUp,
  verifyPlaces,
  verifyLot,
  verifyPricing
};
