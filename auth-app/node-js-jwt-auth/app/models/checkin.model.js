module.exports = (sequelize, Sequelize) => {
    const CheckIn = sequelize.define("checkin_transaction", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        park_id: {
            type: Sequelize.STRING
        },
        vehicle_id: {
            type: Sequelize.STRING
        },
        unique_id: {
            type: Sequelize.STRING
        },
        is_checkout:{
            type:Sequelize.TINYINT,
            allowNull:false,
            defaultValue: "1"
        }
    });
    return CheckIn;
};