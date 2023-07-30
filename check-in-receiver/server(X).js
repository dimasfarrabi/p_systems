const amqp = require("amqplib");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var request = require('request');

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
    var options = {
        uri: 'http://203.175.10.26:6868/api/lot/check_in',
        method: 'POST',
        json: {
          "location": data.location,
          "type": data.type,
          "specialid": data.specialid,
          "dateTime": data.dateTime
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body.id)
        }
        else{
          console.log(error);
        }
    });
    channel.ack(msg);
  });
}

consumeMessages();