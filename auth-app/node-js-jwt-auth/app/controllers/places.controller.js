const db = require("../models");
let configure = require("../config/db_configure");
let mysqli = require('mysql');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.add = (req,res) => {
    var sql1 = "INSERT INTO places (park_name,park_address,capacity,is_Active,createdAt,updatedAt) ";
    var sql2 = "VALUES ('"+req.body.name+"','"+req.body.address+"','"+req.body.capacity+"','1',curdate(),curdate())";
    var sql = sql1+sql2;
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
exports.line = (req,res) => { 
    var sql = "SELECT park_id,park_name,park_address,capacity FROM places WHERE is_Active = '1'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        res.status(200).send({ results });
    });
        
    connection.end();
};
exports.update = (req,res) => {
    var sql = "UPDATE places SET park_name = '"+req.body.name+"',park_address = '"+req.body.address+"',capacity = '"+req.body.capacity+"' WHERE park_id = '"+req.body.id+"'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Updated!" });
    });
    
    connection.end();
};
exports.remove = (req,res) => { 
    var idx = { id: req.params.id }
    var sql = "UPDATE places SET is_Active = '0' WHERE park_id = '"+req.params.id+"'";
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