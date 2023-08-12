let configure = require("../config/db_configure");
let mysqli = require('mysql');
// const fetch = require('node-fetch');
import fetch from "node-fetch";
const url = 'https://api.midtrans.com/v1/payment-links';
var ServerKey = "SB-Mid-server-nwqY13Tag_fcR-sec1iGZpRx:";
var encodeServerKey = btoa(ServerKey);
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const midtransClient = require('midtrans-client');
/*
let core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'SB-Mid-server-2bMmJvpP39fj1GL-bpl13rTk',
    clientKey : 'SB-Mid-client-G0BGoGniZEitMhCv'
});
*/
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
    var sql1 = "SELECT A.createdAt as checkin_time,'"+timenow+"' as checkout_time,TIMEDIFF('"+timenow+"',A.createdAt) as total_hours, B.price as price_first_hour,B.addons_price as cummulative, CASE WHEN (HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1)*B.addons_price) END as final_price FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"' AND A.is_checkout = '0'";
    
    var sql = sql1
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.length );
        if(results.length != '0'){
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  authorization: 'Basic '+encodeServerKey
                },
                body: JSON.stringify({
                  transaction_details: {order_id: req.params.id, gross_amount: results[0].final_price},
                  usage_limit: 2
                })
            };
            fetch(url, options)
            // .then(res => res.json())
            .then(chargeResponse => {
                res.status(200).send({ chargeResponse });
                var sql2 = "UPDATE checkin_transactions SET is_checkout = '1' WHERE unique_id = '"+req.params.id+"';";
                var sql3 = "INSERT INTO invoices (unique_id,user_id,officer_id,date_in,date_out,final_price,payment_status,createdAt) SELECT A.unique_id,A.user_id,NULL as officer_id,A.createdAt as date_in,'"+timenow+"' as date_out,CASE WHEN (HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1)*B.addons_price) END as final_price,'0' as payment_status,'"+timenow+"' as createdAt FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"';";
                connection.query(sql2+" "+sql3, (error, results) => { 
                    if (error){
                        console.log(error.message);
                    }
                });
                connection.end();
            })
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
            /*
            let parameter = {
                "payment_type": "gopay",
                "transaction_details": {
                    "gross_amount": results[0].final_price,
                    "order_id": "test-transaction-"+req.params.id,
                },
                "gopay": {
                    
                }
            };
            core.charge(parameter)
            .then((chargeResponse)=>{
                res.status(200).send({ chargeResponse });
                var sql2 = "UPDATE checkin_transactions SET is_checkout = '1' WHERE unique_id = '"+req.params.id+"';";
                var sql3 = "INSERT INTO invoices (unique_id,user_id,officer_id,date_in,date_out,final_price,payment_status,createdAt) SELECT A.unique_id,A.user_id,NULL as officer_id,A.createdAt as date_in,'"+timenow+"' as date_out,CASE WHEN (HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1) < 1 THEN B.price ELSE B.price+((HOUR(TIMEDIFF('"+timenow+"',A.createdAt))-1)*B.addons_price) END as final_price,'0' as payment_status,'"+timenow+"' as createdAt FROM checkin_transactions as A LEFT JOIN pricing_lots as B ON B.parking_lot_id = A.park_id AND B.vehicle_id = A.vehicle_id WHERE A.unique_id = '"+req.params.id+"';";
                connection.query(sql2+" "+sql3, (error, results) => { 
                    if (error){
                        console.log(error.message);
                    }
                });
                connection.end();
            });
            */
        }
        else{
            res.status(200).send({ message: 'Data Not Found' });
        }
    });
};

exports.confirmation = (req,res) => {
    var timenow = new Date().toLocaleString('sv-SE',{ timeZone: 'Asia/Jakarta' });
    var sql = "UPDATE checkin_transactions SET is_confirmed = '1',createdAt = '"+timenow+"' WHERE unique_id = '"+req.params.id+"' AND is_confirmed = '0'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.length );
        if(results.length != '0'){
            res.status(200).send({ message: 'Confirmed', UniqueID: req.params.id });
        }
        else{
            res.status(500).send({ message: 'Data Not Found' });
        }
    });
    
    connection.end();
};

exports.client_confirmation = (req,res) => {
    var sql = "SELECT COUNT(*) as num FROM WHERE unique_id = '"+req.params.id+"' AND is_confirmed = '1'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows );
        if(results[0].num != '0'){
            res.status(200).send({ message: 'Confirmed', UniqueID: req.params.id });
        }
        else{
            res.status(200).send({ message: 'Data Unconfirmed', UniqueID: req.params.id });
        }
    });
    
    connection.end();
};