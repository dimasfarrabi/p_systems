let configure = require("../config/db_configure");
let mysqli = require('mysql');


checkConfirmation = (req, res, next) => {
    let connection = mysqli.createConnection(configure);
    var sql1 = "SELECT COUNT(*) as num FROM WHERE unique_id = '"+req.params.id+"' AND is_confirmed = '1'";
    connection.query(sql1, (error, results) => {
        if (error){
            res.status(500).send({ message: error.message });
            connection.end();
            return;
        }
        if(results[0].num != '0'){
            connection.end();
            next();
        }
        else{
            res.status(200).send({ message: 'Data Unconfirmed', UniqueID: req.params.id });
            connection.end();
            return;
        }
    });
    
};
const verifyUniqueId = {
    checkConfirmation: checkConfirmation
};

module.exports = verifyUniqueId;