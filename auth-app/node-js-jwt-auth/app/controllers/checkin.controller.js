let configure = require("../config/db_configure");
let mysqli = require('mysql');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.checkin = (req,res) => {
    let specialid = (Math.random() + 1).toString(36).substring(5);
    var timenow = new Date().toLocaleString('sv-SE',{ timeZone: 'Asia/Jakarta' });
    var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, user_id, is_checkout, createdAt, updatedAt) VALUES ('"+req.body.lot_id+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.vehicle+"' LIMIT 1),'"+specialid+"','"+req.body.user_id+"','0','"+timenow+"',NOW())";
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
exports.check_in = (req,res) => {
    var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+req.body.location+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+req.body.type+"' LIMIT 1),'"+req.body.specialid+"','0','"+req.body.dateTime+"',NOW())";
    console.log(sql);
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ uniqueid: req.body.specialid, checkinTime: req.body.dateTime });
    });
    
    connection.end();
};
exports.checkout = (req,res) => {
    var timenow = new Date().toLocaleString('sv-SE',{ timeZone: 'Asia/Jakarta' });
    var sql1 = "SELECT A.createdAt as checkin_time,'"+timenow+"' as checkout_time,TIMEDIFF('"+timenow+"',A.createdAt) as total_hours, B.price as price_first_hour,B.addons_price as cummulative, CASE WHEN (HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1)*B.addons_price) END as final_price FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"' AND A.is_checkout = '0';";
    var sql2 = "UPDATE checkin_transactions SET is_confirmed = '1' WHERE is_checkout = '"+req.params.id+"';";
    var sql3 = "INSERT INTO invoices (unique_id,user_id,officer_id,date_in,date_out,final_price,payment_status,createdAt) SELECT A.unique_id,A.user_id,NULL as officer_id,A.createdAt as date_in,'"+timenow+"' as date_out,CASE WHEN (HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1)*B.addons_price) END as final_price,'0' as payment_status,'"+timenow+"' as createdAt FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"';";
    var sql = sql1+" "+sql2+" "+sql3;
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

exports.confirmation = (req,res) => {
    var sql = "UPDATE checkin_transactions SET is_confirmed = '1' WHERE unique_id = '"+req.params.id+"'";
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