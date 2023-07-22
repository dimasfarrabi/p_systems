const db = require("../models");

const Places = db.places;

checkPlaceName = (req, res, next) => {
    Places.findOne({
        where: {
            park_name: req.body.name
        }
        }).then(places => {
        if (places) {
            res.status(400).send({
            message: "parking area name is already in use!"
            });
            return;
        }
    });
    next();
};
const verifyPlaces = {
    checkPlaceName: checkPlaceName
};

module.exports = verifyPlaces;