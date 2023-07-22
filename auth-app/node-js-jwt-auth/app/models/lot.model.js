module.exports = (sequelize, Sequelize) => {
    const Lot = sequelize.define("parking_lot", {
        lot_id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        parking_lot_name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        is_active:{
            type:Sequelize.TINYINT,
            allowNull:false,
            defaultValue: "1"
        },
        longitude:{
            type: Sequelize.STRING
        },
        latitude:{
            type: Sequelize.STRING
        }
    });
    return Lot;
};