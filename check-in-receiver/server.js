const amqp = require("amqplib");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var request = require('request');
let configure = require("./config/db_configure");
let mysqli = require('mysql');


var corsOptions = {
    origin: "http://localhost:8082"
};

async function consumeMessages() {
  const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
  
  const channel = await connection.createChannel();

  await channel.assertExchange("logExchange", "direct");

  const q = await channel.assertQueue("InfoQueue");

  await channel.bindQueue(q.queue, "logExchange", "CheckIn");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, user_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+data.location+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+data.type+"' LIMIT 1),'"+data.user+"','"+data.specialid+"','0','"+data.dateTime+"',NOW()";
    console.log(sql);
    let mysylConn = mysqli.createConnection(configure);
    mysylConn.query(sql, (error, results) => {
        if (error){
          console.log(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
    });
    mysylConn.end();
    channel.ack(msg);
  });
}

consumeMessages();