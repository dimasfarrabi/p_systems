const amqp = require("amqplib/callback_api");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const Consumer = require("./Consumer");
const consumer = new Consumer();

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
    try{
      await consumer.consumeToSql(data);
    }
    catch(err){
      return console.log('Bad request');
    }
    /*var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+data.location+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+data.type+"' LIMIT 1),'"+data.specialid+"','0','"+data.dateTime+"',NOW())";
    console.log(sql);
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
        if (error){
          console.log(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
    });
    connection.end();*/
    channel.ack(msg);
  });
}

consumeMessages();