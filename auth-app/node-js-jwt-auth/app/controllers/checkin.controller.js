let configure = require("../config/db_configure");
let mysqli = require('mysql');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.checkin = (req,res) => {
    let specialid = (Math.random() + 1).toString(36).substring(5);
    var timenow = new Date().toLocaleString({ timeZone: 'Asia/Jakarta' });
    var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+req.body.lot_id+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.vehicle+"' LIMIT 1),'"+specialid+"','0',NOW(),NOW())";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ uniqueid: specialid, checkinTime: timenow });
    });
    
    connection.end();
};
exports.checkout = (req,res) => {
    var timenow = new Date().toLocaleString({ timeZone: 'Asia/Jakarta' });
    var sql = "SELECT A.createdAt as checkin_time,NOW() as checkout_time,TIMEDIFF(NOW(),A.createdAt) as total_hours, B.price as price_first_hour,B.addons_price as cummulative, CASE WHEN (HOUR(TIMEDIFF(NOW(),A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF(NOW(),A.createdAt))-1)*B.addons_price) END as final_price FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"' AND A.is_checkout = '0'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.length );
        if(results.length != '0'){
            res.status(200).send({ results });
        }
        else{
            res.status(500).send({ message: 'Data Not Found' });
        }
    });
    
    connection.end();
};