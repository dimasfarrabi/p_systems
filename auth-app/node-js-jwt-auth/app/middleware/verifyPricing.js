let configure = require("../config/db_configure");
let mysqli = require('mysql');

const db = require("../models");

const Lots = db.lot;
const Vehicle = db.vehicle;

checkPricing = (req, res, next) => {
    let connection = mysqli.createConnection(configure);
    var sql1 = "SELECT COUNT(*) as num FROM pricing_lots WHERE parking_lot_id = '"+req.body.lotid+"' AND vehicle_id IN (SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.vehicle+"')";
    if(req.body.vehicle == 'Car' || req.body.vehicle == 'Bike'){
        connection.query(sql1, (error, results) => {
            if (error){
                res.status(500).send({ message: error.message });
                connection.end();
                return;
            }
            if(results[0].num == '0'){
                connection.end();
                next();
            }
            else{
                res.status(500).send({ message: "Data already Exist" });
                connection.end();
                return;
            }
        });
    }
    else{
        res.status(500).send({ message: 'vehicle not available' });
        connection.end();
        return;
    }
};
const verifyPricing = {
    checkPricing: checkPricing
};

module.exports = verifyPricing;