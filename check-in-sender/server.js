const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Producer = require("./Producer");
const producer = new Producer();
const app = express();
const amqp = require("amqplib");
let channel, connection;

var corsOptions = {
    origin: "http://localhost:8083"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome mdfk to Service 2." });
});
app.post("/sendLog", async (req, res, next) => {
    let UniqueID = (Math.random() + 1).toString(36).substring(5);
    var timenow = new Date().toLocaleString('sv-SE',{ timeZone: 'Asia/Jakarta' })
    try{
        await producer.publishMessage(req.body.checkType,req.body.parkingId,req.body.vehicle,UniqueID,timenow);
    } catch(err){
        return res.status(500).send({ message: "Request Error" });
    }
    // res.send();
    res.status(200).send({ uniqueid: UniqueID, checkinTime: timenow});
});
// routes

// set port, listen for requests
const PORT = process.env.PORT || 8282;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
