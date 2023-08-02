let configure = require("../config/db_configure");
let mysqli = require('mysql');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.add = (req,res) => {
    var sql1 = "INSERT INTO parking_lots (parking_lot_name,address,createdAt,updatedAt,longitude,latitude) VALUES ('"+req.body.name+"','"+req.body.address+"',CURDATE(),CURDATE(),'"+req.body.longitude+"','"+req.body.latitude+"')";
    var sql = sql1;
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Imported!" });
    });
    
    connection.end();
};
exports.editaddress = (req,res) => {
    let connection = mysqli.createConnection(configure);
    var sql = "UPDATE parking_lots SET parking_lot_name = '"+req.body.name+"',address = '"+req.body.address+"',longitude = '"+req.body.longitude+"',latitude = '"+req.body.latitude+"', updatedAt = CURDATE() WHERE lot_id = '"+req.body.id+"'";
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Saved!" });
    });
    connection.end();
};
exports.list = (req,res) => { 
    var sql = "SELECT * FROM parking_lots WHERE is_active = '1'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        res.status(200).send({ results });
    });
        
    connection.end();
};
exports.newdetail = (req,res) => {
    let connection = mysqli.createConnection(configure);
    var sql2 = "INSERT INTO pricing_lots (parking_lot_id, vehicle_id, capacity, price, booking_price, addons_price, createdAt, updatedAt) VALUES  ((SELECT lot_id FROM parking_lots WHERE lot_id = '"+req.body.lotid+"' LIMIT 1), (SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.vehicle+"' LIMIT 1),'"+req.body.capacity+"','"+req.body.price+"','"+req.body.specialprice+"','"+req.body.addonprice+"',CURDATE(),CURDATE())";
    var sql = sql2;
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Imported!" });
    });
    connection.end();
};
exports.details = (req,res) => { 
    var sql = "SELECT A.*,B.parking_lot_name,B.longitude,B.latitude,C.vehicle,(SELECT COUNT(D.id) FROM checkin_transactions as D WHERE D.park_id = A.parking_lot_id AND D.vehicle_id = A.vehicle_id AND is_checkout = '0') as current_volume FROM pricing_lots as A LEFT JOIN parking_lots as B ON B.lot_id = A.parking_lot_id LEFT JOIN vehicle_types as C ON C.id = A.vehicle_id WHERE B.is_active = '1'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        res.status(200).send({ results });
    });
        
    connection.end();
};
exports.edit = (req,res) => {
    let connection = mysqli.createConnection(configure);
    var sql = "UPDATE pricing_lots SET capacity = '"+req.body.capacity+"', price = '"+req.body.price+"', booking_price = '"+req.body.specialprice+"', addons_price = '"+req.body.addonprice+"', updatedAt = CURDATE() WHERE parking_lot_id = '"+req.body.lotid+"' AND vehicle_id IN (SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.vehicle+"')";
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Saved!" });
    });
    connection.end();
};
exports.remove = (req,res) => { 
    var idx = { id: req.params.id }
    var sql = "UPDATE parking_lots SET is_active = '0', updatedAt = CURDATE() WHERE lot_id = '"+req.params.id+"'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Deleted!" });
    });
    
    connection.end();
};
