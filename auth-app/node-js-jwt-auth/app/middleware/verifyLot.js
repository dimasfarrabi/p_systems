const db = require("../models");

const Lots = db.lot;

checkPlaceName = (req, res, next) => {
    Lots.findOne({
        where: {
            parking_lot_name: req.body.name
        }
        }).then(lot => {
        if (lot) {
            res.status(400).send({
                message: "parking area name is already in use!"
            });
            return;
        }
        next();
    });
};
const verifyLot = {
    checkPlaceName: checkPlaceName
};

module.exports = verifyLot;