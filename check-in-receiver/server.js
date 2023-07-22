const amqp = require("amqplib");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
let configure = require("./config/db_configure");
let mysqli = require('mysql');

var corsOptions = {
    origin: "http://localhost:8082"
};

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost:5673");
  const channel = await connection.createChannel();

  await channel.assertExchange("logExchange", "direct");

  const q = await channel.assertQueue("InfoQueue");

  await channel.bindQueue(q.queue, "logExchange", "CheckIn");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+data.lot_id+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+data.vehicle+"' LIMIT 1),'"+data.specialid+"','0',NOW(),NOW())";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
          console.log(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
    });
    connection.end();
    channel.ack(msg);
  });
}

consumeMessages();