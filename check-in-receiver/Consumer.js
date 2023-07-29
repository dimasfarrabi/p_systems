const amqp = require("amqplib");
let configure = require("./config/db_configure");
let mysqli = require('mysql');

class Consumer{
    async consumeToSql(data){
        var sql = "INSERT INTO checkin_transactions(park_id, vehicle_id, unique_id, is_checkout, createdAt, updatedAt) VALUES ('"+data.location+"',(SELECT id FROM vehicle_types WHERE vehicle = '"+data.type+"' LIMIT 1),'"+data.specialid+"','0','"+data.dateTime+"',NOW())";
        console.log(sql);
        let connection = mysqli.createConnection(configure);
        connection.query(sql, (error, results) => {
            if (error){
            console.log(error.message);
            }
            console.log('Rows affected:', results.affectedRows);
        });
        connection.end();
    }
}

module.exports = Consumer;